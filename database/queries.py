import config

SELECT_ALL_WORDS = f'SELECT * FROM {config.TABLE_NAME} WHERE lang = ?;'

INSERT_NEW_WORD = f'INSERT INTO {config.TABLE_NAME}(original, translate, transcription, lang, date_to_add) VALUES(?, ?, ?, ?, ?);'

UPDATE_WORD = f'UPDATE {config.TABLE_NAME} SET original=?, translate=?, transcription=?, lang = ? WHERE id = ?;'

DELETE_WORD_BY_ID = f'DELETE FROM {config.TABLE_NAME} WHERE id = ?;'

DELETE_ALL_WORDS = f'DELETE FROM {config.TABLE_NAME} WHERE lang = ?;'

GET_TRANSLATE_AND_TRANSCRIPTION_BY_ENGLISH_WORD = lambda is_word_part, is_first_letter=False: f""" SELECT translate, transcription FROM 
{config.TABLE_NAME} WHERE original LIKE {'?' if not is_word_part else '? || "%"' if is_first_letter else '"%" || ? || "%"'} AND lang = ?; """

GET_TRANSLATE_AND_TRANSCRIPTION_BY_DEUTSCH_WORD = lambda is_word_part, is_first_letter=False: f""" SELECT translate, transcription FROM 
{config.TABLE_NAME} WHERE original LIKE {'?' if not is_word_part else '? || "%"' if is_first_letter else '"%" || ? || "%"'} AND lang = ?; """

GET_TRANSLATE_AND_TRANSCRIPTION_BY_RUSSIAN_WORD = lambda is_word_part, is_first_letter=False: f""" SELECT original, transcription FROM 
{config.TABLE_NAME} WHERE translate LIKE {'?' if not is_word_part else '? || "%"' if is_first_letter else '"%" || ? || "%"'};"""

GET_DICTIONARIES = f""" SELECT DISTINCT lang FROM {config.TABLE_NAME} """

GET_WORD_FULL_INFO_BY_WORD = lambda field : f'SELECT * FROM {config.TABLE_NAME} WHERE {field} = ? AND lang = ?;'

GET_WORDS_AMOUNT_BY_ORIGINAL_WORD = f"SELECT COUNT(*) FROM {config.TABLE_NAME} WHERE lang = ? AND original = ?;"

# GET_ALL_WORDS_INFO_FOR_GUESS_GAME = f'SELECT original, translate, transcription, lang, date_to_add FROM {config.TABLE_NAME};'

GET_WORDS_OF_CONCRETE_LANG_INFO_FOR_GUESS_GAME = f'SELECT original, translate, transcription, lang, date_to_add FROM {config.TABLE_NAME} WHERE lang = ?;'