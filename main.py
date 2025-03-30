from typing import List
from flask import Flask, render_template, request
import requests
from bs4 import BeautifulSoup
import help_funcs
import config
from database import queries
from foreign_lang import ForeignLang
from os import remove
import json

app = Flask(__name__)


@app.route('/')
def index():
  db = help_funcs.connect_to_db()
  db.create_table(config.TABLE_NAME, config.TABLE_FIELDS)

  return render_template('index.html')


@app.route('/translate/', methods=['GET'])
def translate(is_word_in_dictionary: bool = False, has_word_add: bool = False, lang_from: str = config.EN_LANG_ALIAS,
              lang_to: str = config.RU_LANG_ALIAS):
  service_name = help_funcs.open_json(config.SERVICE_JSON_NAME)
  is_service_google = service_name == config.GOOGLE_SEVICE_NAME

  return render_template('translate.html', is_service_google=is_service_google,
               is_word_in_dictionary=is_word_in_dictionary, has_word_add=has_word_add,
               _from=lang_from, to=lang_to,
               foreign_langs={foreign_lang.name : foreign_lang.value for foreign_lang in ForeignLang})


@app.route('/dictionaries/', methods=['GET'])
def my_dictionaries():
  db = help_funcs.connect_to_db()
  my_dicts = db.query_execute(queries.GET_DICTIONARIES, is_fetch_all=True)

  code_name_dict_dct = {my_dict[0] : ForeignLang.get_lang_by_code(my_dict[0]) for my_dict in my_dicts}
  return render_template('dictionary_type.html', my_dicts=code_name_dict_dct, title='Мои словари',
               next_page='dictionary')


@app.route('/dictionary/<dictionary_lang_code>/', methods=['GET'])
def show_dictionary(dictionary_lang_code: str):
  db = help_funcs.connect_to_db()

  words = db.query_execute(queries.SELECT_ALL_WORDS, params=(dictionary_lang_code,), is_fetch_all=True)

  return render_template('dictionary.html', words=words, dictionary_lang_name=ForeignLang.get_lang_by_code(dictionary_lang_code),
                         dictionary_lang_code=dictionary_lang_code, href_back='/dictionaries/')


@app.route('/guess_words/', methods=['GET'])
def show_dicts_for_guess_words():
  db = help_funcs.connect_to_db()
  my_dicts = db.query_execute(queries.GET_DICTIONARIES, is_fetch_all=True)

  code_name_dict_dct = {my_dict[0]: ForeignLang.get_lang_by_code(my_dict[0]) for my_dict in my_dicts}
  return render_template('dictionary_type.html', my_dicts=code_name_dict_dct, title='Словари для угадывания слов',
               is_game=True, next_page='guess_words')


@app.route('/guess_words/<lang_code>/', methods=['GET'])
def guess_words(lang_code: str):
  db = help_funcs.connect_to_db()

  words_for_guess = db.query_execute(queries.GET_WORDS_OF_CONCRETE_LANG_INFO_FOR_GUESS_GAME, params=(lang_code,),
                                     is_fetch_all=True)

  # lang_words_dct = {}
  #
  # for word_for_guess in words_for_guess:
  #   lng = word_for_guess[3]
  #
  #   if lng in lang_words_dct:
  #     lang_words_dct[lng].append(word_for_guess)
  #   else:
  #     lang_words_dct[lng] = [word_for_guess]

  # print(f'WORDS FOR QUESS: {words_for_guess}')
  lang_name = ForeignLang.get_lang_by_code(lang_code)
  return render_template('guess_words.html', words=words_for_guess, lang_code=lang_code, lang_name=lang_name)


@app.route('/guess_words/<lang_code>/game/', methods=['GET'])
def game(lang_code: str):
  lang_name = ForeignLang.get_lang_by_code(lang_code)
  lang_name = lang_name[:-2] + 'ом' if lang_name.endswith('ий') else lang_name
  return render_template('game.html', lang=lang_name)


@app.route('/guess_words/<lang_code>/game/statistic/<total_words>/<right_answers_count>/<wrong_answers_count>/',
       methods=['GET', 'POST'])
def statistic(lang_code: str, total_words: str, right_answers_count: str, wrong_answers_count: str):
  total_words_num, right_answers_count_num, wrong_answers_count_num, percent = 0, 0, 0, 0.0
  lang_name = ForeignLang.get_lang_by_code(lang_code)
  lang_name = lang_name[:-2] + 'ом' if lang_name.endswith('ий') else lang_name

  if request.method == 'GET':

    if total_words.isdigit() and right_answers_count.isdigit() and wrong_answers_count.isdigit():
      total_words_num = int(total_words)
      right_answers_count_num = int(right_answers_count)
      wrong_answers_count_num = int(wrong_answers_count)

      percent = round((right_answers_count_num * 100) / total_words_num, 2)

  else:

    data: dict = json.loads(request.data.decode())
    wrong_ids: List[int] = data['wrongIds']

    db = help_funcs.connect_to_db()
    db.query_execute(queries.SET_ALL_WORDS_IS_FORGOTTEN_NO, params=(lang_code,))
    db.query_execute(queries.SET_IS_FORGOTTEN_YES, params=[(wrong_id,) for wrong_id in wrong_ids], is_ext=True)

  return render_template('statistic.html', total=total_words_num,
               right=right_answers_count_num, wrong=wrong_answers_count_num, percent=percent, lang=lang_name)


@app.route('/dictionary/<lang>/download/', methods=['GET'])
def download_dictionary(lang: str):
  title = f'Скачать словарь на {lang}'
  words = help_funcs.get_words_from_concrete_dictionary(lang)
  return render_template('download_upload_dictionary.html', title=title, words=words)


@app.route('/dictionary/<lang>//upload/', methods=['GET'])
def upload_dictionary(lang: str):
  title = f'Загрузить словарь на {lang}'
  return render_template('download_upload_dictionary.html', title=title, lang=lang)


@app.route('/translate/<word>/<_from>/<to>/', methods=['GET'])
def get_translate(word: str, _from: str, to: str):
  # print('WORD:', word)
  # print('FROM', _from)
  # print('TO:', to)
  transcription = ''
  is_err = False
  is_source_en = _from == config.EN_LANG_ALIAS
  word = word.strip()

  is_service_google = help_funcs.open_json(config.SERVICE_JSON_NAME) == config.GOOGLE_SEVICE_NAME

  translate_db = help_funcs.get_translate_by_word(word, first_lang=_from, second_lang=to, is_part_word=False)

  if translate_db is None:
    if is_service_google:
      google_api = config.GOOGLE_API % (word, to, _from)
      # google_api = f'https://script.google.com/macros/s/AKfycbzYOnhBQib2cIaOM8XpNrn8g9EzsO8EGyB54rWGfI6kkE14DH7aEB2Ll_abEkMxwdOg/exec?q={word}&target={to}&source={_from}'

      try:
        response = requests.get(google_api, headers=config.HEADERS)

        if response.status_code == config.RESPONSE_OK_STATUS_CODE:
          translate_word = response.text
        else:
          translate_word = ''
          is_err = True
      except Exception as e:
        translate_word = ''
        is_err = True
    else:
      wordhunt_url = config.WORDHUNT_URL + word

      try:
        response = requests.get(wordhunt_url, headers=config.HEADERS, verify=False)

        soup = BeautifulSoup(response.text, 'html.parser')

        if is_source_en:
          text = word.strip()

          if ' ' in text:
            translation = soup.find('div', class_='light_tr')

            if translation:
              translate_word = translation.text
            else:
              translation = soup.find('div', class_='block phrases')

              if translation:
                translate_word = translation.text
              else:
                translate_word = ''
                is_err = True
          else:
            russian_content = soup.find('div', id='content_in_russian')
            try:
              translate_word = russian_content.find('div', class_='t_inline_en').text
            except AttributeError:
              try:
                translate_word = russian_content.find('div', class_='tr').find('span').text
              except AttributeError:
                translate_word = russian_content.find_all('div', class_='block similar_words')[-1].text

            transcription = soup.find('div', class_='trans_sound').find('div', id='uk_tr_sound').find(
              'span').text

            word += ' ' + transcription
        else:
          translate_word = soup.find('div', id='wd_content').text.split('-')[1] \
            .split('-')[0].split('—')[0].strip()

          transcription = translate_word.split()[1]
          translate_word = translate_word.split()[0].strip()

          translate_word += ' ' + transcription
          # translate_word = soup.find('div', id='wd_title').find('p', class_='t_inline').text

      except Exception as e:
        translate_word = ''
        is_err = True

    # soup = BeautifulSoup(response.text, 'html.parser')
    #
    # translate_word = soup.find('body')

    # print('TRANSLATE:', translate_word)
    # print('TRANSCRIPTION:', transcription)

  else:
    # print('IN DB')
    translate_word = translate_db[0]

    if is_source_en:
      word += translate_db[1]
    else:
      translate_word += translate_db[1]

  return render_template('translate.html', _from=_from, to=to,
               word=word, trans=translate_word, is_err=is_err, is_service_google=is_service_google,
               foreign_langs={foreign_lang.name : foreign_lang.value for foreign_lang in ForeignLang})


@app.route('/add_new_word/<word1>/<word2>/<first_lang>/<second_lang>/')
def add_word_in_db(word1: str, word2: str, first_lang: str, second_lang: str):
  original_word = (word2 if first_lang == config.RU_LANG_ALIAS else word1).capitalize()
  russian_word = (word1 if first_lang == config.RU_LANG_ALIAS else word2).capitalize()

  transcription = ''

  if config.TRANSCRIPTION_BRACE in original_word:
    word_parts = original_word.split(config.TRANSCRIPTION_BRACE)
    transcription = config.TRANSCRIPTION_BRACE + word_parts[1]
    original_word = word_parts[0].strip()

  if help_funcs.check_if_word_in_db(original_word, first_lang):
    return translate(is_word_in_dictionary=True)

  help_funcs.add_word_in_db(original_word, russian_word, transcription,
                            first_lang if first_lang != config.RU_LANG_ALIAS else second_lang)

  return translate(has_word_add=True, lang_from=first_lang, lang_to=second_lang)


@app.route('/delete_word/', methods=['POST'])
def delete_word():
  db = help_funcs.connect_to_db()
  # print('DELETE ALL')

  data: dict = json.loads(request.data.decode())

  # print('DATA:', data)
  word_remove_ids: list = data['wordIds']
  lang: str = data['lang']

  if word_remove_ids:
    db.query_execute(queries.DELETE_WORD_BY_ID, params=word_remove_ids, is_ext=True)
    # print('DELETE WORD:', word_id)
  else:
    db.query_execute(queries.DELETE_ALL_WORDS, params=(lang,))

  return show_dictionary(lang)


@app.route('/dictionary/<dictionary_lang>/change/<word_id>/<word_en>/<word_ru>/<transcription>/',
       methods=['GET', 'POST'])
def change_word(dictionary_lang: str, word_id: str, word_en: str, word_ru: str, transcription: str):
  title = 'Изменить слово'
  word_id = int(word_id)
  msg = ''

  db = help_funcs.connect_to_db()
  my_dicts = db.query_execute(queries.GET_DICTIONARIES, is_fetch_all=True)
  my_dicts = [lang[0] for lang in my_dicts]

  lang = None
  if request.method == 'POST':
    is_err, word_en, word_ru, transcription, lang = help_funcs.prepare_words_and_check(request)

    if not is_err:
      db = help_funcs.connect_to_db()
      db.query_execute(queries.UPDATE_WORD, params=(word_en, word_ru, transcription, lang, word_id))
      msg = 'Слово успешно изменено'
    else:
      msg = 'Ошибка изменения слова'

  return render_template('add_change_word.html', title=title, msg=msg,
               word_id=word_id, word_en=word_en, word_ru=word_ru,
               transcription=transcription, my_dicts=my_dicts, lang=lang if lang else dictionary_lang,
               href_back=f'/dictionary/{dictionary_lang}/')


@app.route('/add_new_word/', methods=['GET', 'POST'])
def add_new_word():
  title = 'Добавить слово'
  msg = ''

  lang = None
  if request.method == 'POST':
    is_err, word_original, word_ru, transcription, lang = help_funcs.prepare_words_and_check(request)

    if is_err:
      msg = 'Ошибка добавления слова'
    elif help_funcs.check_if_word_in_db(word_original, lang):
      msg = 'Данное слово уже содержится в словаре'
    else:
      help_funcs.add_word_in_db(word_original, word_ru, transcription, lang)
      msg = 'Слово успешно добавлено в словарь'

  return render_template('add_change_word.html', title=title,
               msg=msg, my_langs={lang.name : lang.value[:-2] + 'ом' if lang.value.endswith('ий') else lang.value
                                  for lang in ForeignLang}, lang=lang, href_back='/')


@app.route('/dictionary/<lang>/search/<word_part>/', methods=['GET'])
def search_word_card(lang: str, word_part: str):
  words = help_funcs.search_words(word_part, lang)
  # print(f'WORDS: {words}')
  is_err = False
  is_search = True

  if not words:
    is_err = True

  return render_template('dictionary.html', words=words,
               href_back='../../', is_err=is_err, is_search=is_search, dictionary_lang=lang)


@app.route('/update_service/<service>/<first_lang>/<second_lang>/', methods=['GET'])
def update_service(service: str, first_lang: str, second_lang: str):
  help_funcs.open_json(config.SERVICE_JSON_NAME, mode='w', service_name=service)
  is_service_google = service == config.GOOGLE_SEVICE_NAME
  return render_template('translate.html', is_service_google=is_service_google, _from=first_lang,
               to=second_lang, foreign_langs={foreign_lang.name : foreign_lang.value for foreign_lang in ForeignLang})


@app.route('/upload_file/<lang>/', methods=['POST'])
def upload_file(lang: str):
  file = request.files['words']
  delimiter = request.form['delimiter']
  file_full_path = config.FILES_DIR_PATH + file.filename
  file.save(file_full_path)

  help_funcs.read_words_from_file_and_add_to_dict(file_full_path, lang, delimiter)

  remove(file_full_path)

  return render_template('dictionary.html', upload_new_words=True, lang=lang)


if __name__ == '__main__':
  app.run(debug=True, host='0.0.0.0', port=8000)
