HEADERS = {
	'User-Agent' : 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
}

CURRENT_DATE_PATTERN = "%Y-%m-%d %H:%M:%S"  # Паттерн формата даты обновления датасета на сайте

WORDHUNT_URL = 'https://wooordhunt.ru/word/'

GOOGLE_API_KEY = 'AKfycbzYOnhBQib2cIaOM8XpNrn8g9EzsO8EGyB54rWGfI6kkE14DH7aEB2Ll_abEkMxwdOg'
GOOGLE_API = f'https://script.google.com/macros/s/{GOOGLE_API_KEY}/exec?q=%s&target=%s&source=%s'

# https://script.google.com/macros/s/AKfycbzYOnhBQib2cIaOM8XpNrn8g9EzsO8EGyB54rWGfI6kkE14DH7aEB2Ll_abEkMxwdOg/exec?q=car&target=ru&source=en
# https://script.google.com/macros/s/AKfycbzYOnhBQib2cIaOM8XpNrn8g9EzsO8EGyB54rWGfI6kkE14DH7aEB2Ll_abEkMxwdOg/exec?q=Жизнь&target=de&source=ru

SERVICE_JSON_NAME = 'service/service.json'
FILES_DIR_PATH = 'files/'
GOOGLE_SEVICE_NAME = 'google'
WORDS_TABLE_NAME = 'words'
NOTES_TABLE_NAME = 'notes'

RESPONSE_OK_STATUS_CODE = 200

PATH_TO_DB = 'database/test.db'
TABLE_NAME = 'words'
TABLE_FIELDS = {
	'id' : 'integer primary key autoincrement',
    'original' : 'text',
    'translate' : 'text',
	'transcription' : 'varchar(50)',
	'lang' : 'varchar(2)',
	'date_to_add' : 'datetime default current_timestamp',
	'is_forgotten' : 'integer default false'
  }

RU_LANG_ALIAS = 'RU'
EN_LANG_ALIAS = 'EN'
TRANSCRIPTION_BRACE = '|'
