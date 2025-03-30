import config
import json
from database import database, queries
from foreign_lang import ForeignLang
from typing import Union, Tuple, List
from datetime import datetime

def open_json(json_name: str, mode: str = 'r', service_name: str = config.GOOGLE_SEVICE_NAME):
	with open(file=json_name, mode=mode, encoding='UTF-8') as ff:
		if mode == 'r':
			service_name = json.load(ff)['service']
			return service_name
		else:
			json.dump({'service': service_name}, ff)

def connect_to_db(db_name: str = config.PATH_TO_DB) -> database.DB:
	db = database.DB(db_name)
	return db

def get_translate_by_word(word: str, first_lang: str, is_part_word: bool, second_lang: str = None) -> Union[Tuple[str, str], None]:
	db = connect_to_db()

	word = word.capitalize()
	is_first_part = len(word) == 1

	if first_lang == ForeignLang.EN.value:
		query = queries.GET_TRANSLATE_AND_TRANSCRIPTION_BY_ENGLISH_WORD(is_part_word, is_first_part)
		params = [word, first_lang]
	elif first_lang == ForeignLang.DE.value:
		query = queries.GET_TRANSLATE_AND_TRANSCRIPTION_BY_DEUTSCH_WORD(is_part_word, is_first_part)
		params = [word, first_lang]
	elif first_lang == config.RU_LANG_ALIAS:
		query = queries.GET_TRANSLATE_AND_TRANSCRIPTION_BY_RUSSIAN_WORD(is_part_word, is_first_part)
		params = [word, second_lang]
	else:
		return None

	translate = db.query_execute(query, params=tuple(params), is_fetch_one=not is_part_word, is_fetch_all=is_part_word)

	if not translate:
		word = word.lower()
		params[0] = word
		# query = queries.GET_TRANSLATE_AND_TRANSCRIPTION_BY_ENGLISH_WORD(is_part_word, is_first_part) if foreign_lang == config.RU_LANG_ALIAS \
		# 	else queries.GET_TRANSLATE_AND_TRANSCRIPTION_BY_RUSSIAN_WORD(is_part_word, is_first_part)

		translate = db.query_execute(query, params=tuple(params), is_fetch_one=not is_part_word, is_fetch_all=is_part_word)

	return translate

def check_if_word_in_db(original_word: str, lang: str) -> bool:
	db = connect_to_db()

	word = original_word.capitalize()

	for i in range(2):
		word_in_db = db.query_execute(queries.GET_WORDS_AMOUNT_BY_ORIGINAL_WORD, params=(lang, word), is_fetch_one=True)[0]

		if word_in_db == 0:
			word = word.lower()
		else:
			return True
	return False

def add_word_in_db(original_word: str, word_ru: str, transcription: str, lang: str):
	original_word = original_word.title()
	word_ru = word_ru.capitalize()
	transcription = transcription.capitalize()
	current_date = datetime.now().strftime(config.CURRENT_DATE_PATTERN)

	db = connect_to_db()
	db.query_execute(queries.INSERT_NEW_WORD, params=(original_word, word_ru, transcription, lang, current_date))

def search_words(word_part: str, lang: str) -> List[Tuple[int, str, str, str, int]]:
	db = connect_to_db()

	is_en = False
	words = get_translate_by_word(word_part, first_lang=lang, is_part_word=True)

	if not words:
		is_en = True
		words = get_translate_by_word(word_part, first_lang=config.RU_LANG_ALIAS, second_lang=lang, is_part_word=True)

	if not words:
		return []

	find_words = []
	search_field_name = 'original' if is_en else 'translate'

	for word in words:
		word_full_info = db.query_execute(queries.GET_WORD_FULL_INFO_BY_WORD(search_field_name), params=(word[0], lang), is_fetch_one=True)

		if word_full_info:
			find_words.append(word_full_info)

	return find_words



def prepare_words_and_check(req) -> Tuple[bool, str, str, str, str]:
	data = req.form
	original_word = data.get('original_word')
	word_ru = data.get('word_ru')
	transcription = data.get('transcription')
	lang = data.get('lang')
	is_err = False

	if not original_word:
		is_err = True
	if not word_ru:
		is_err = True

	if not is_err:
		original_word = original_word.strip()
		word_ru = word_ru.strip()

		if transcription:
			transcription = transcription.strip()

	return is_err, original_word, word_ru, transcription, lang


def get_words_from_concrete_dictionary(lang: str) -> List[Tuple[str, str, str, str]]:
	db = connect_to_db()
	words = db.query_execute(queries.GET_WORDS_OF_CONCRETE_LANG_INFO_FOR_GUESS_GAME, params=(lang,), is_fetch_all=True)
	return words

def read_words_from_file_and_add_to_dict(file_path: str, lang: str, delimiter: str):
	with open(file=file_path, mode='r', encoding='UTF-8') as ff:
		for i, line in enumerate(ff):
			# if i == 0:
			# 	continue

			items = line.split(delimiter)
			original_word = items[0].strip()
			translate_word = ','.join(items[1:]).strip()
			transcription = ''

			add_word_in_db(original_word, translate_word, transcription, lang)