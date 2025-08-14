import config

CREATE_NOTES_TABLE = f""" CREATE TABLE IF NOT EXISTS {config.NOTES_TABLE_NAME} (
                                                            id integer primary key autoincrement,
                                                            title text,
                                                            content text,
                                                            lang varchar(2),
                                                            date_to_add datetime default current_timestamp
                                                        ); """

SELECT_ALL_NOTES_BY_LANG = f""" SELECT * FROM {config.NOTES_TABLE_NAME} WHERE lang = ?; """

SELECT_NOTE_BY_ID = f""" SELECT * FROM {config.NOTES_TABLE_NAME} WHERE id = ?; """

INSERT_NEW_NOTE = f""" INSERT INTO {config.NOTES_TABLE_NAME}(title, content, lang, date_to_add) VALUES (?, ?, ?, ?); """

UPDATE_NOTE_BY_ID = f""" UPDATE {config.NOTES_TABLE_NAME} SET title=?, content=?, lang=? WHERE id = ?; """

DELETE_NOTE_BY_ID = f""" DELETE FROM {config.NOTES_TABLE_NAME} WHERE id = ?; """

DELETE_ALL_NOTES_BY_LANG = f""" DELETE FROM {config.NOTES_TABLE_NAME} WHERE lang = ?; """

GET_NOTE_FULL_INFO_BY_TITLE = lambda is_first_letter=False: f""" SELECT * FROM {config.NOTES_TABLE_NAME} WHERE title LIKE {'? || "%"' if is_first_letter else '"%" || ? || "%"'} AND lang = ?; """

SELECT_ALL_WORDS_BY_LANG = f""" SELECT * FROM {config.WORDS_TABLE_NAME} WHERE lang = ?; """

INSERT_NEW_WORD = f""" INSERT INTO {config.WORDS_TABLE_NAME}(original, translate, transcription, lang, date_to_add) VALUES(?, ?, ?, ?, ?); """

UPDATE_WORD_BY_ID = f""" UPDATE {config.WORDS_TABLE_NAME} SET original=?, translate=?, transcription=?, lang = ? WHERE id = ?; """

DELETE_WORD_BY_ID = f""" DELETE FROM {config.WORDS_TABLE_NAME} WHERE id = ?; """

DELETE_ALL_WORDS_BY_LANG = f""" DELETE FROM {config.WORDS_TABLE_NAME} WHERE lang = ?; """

GET_TRANSLATE_AND_TRANSCRIPTION_BY_ENGLISH_WORD = lambda is_word_part, is_first_letter=False: f""" SELECT translate, transcription FROM 
{config.WORDS_TABLE_NAME} WHERE original LIKE {'?' if not is_word_part else '? || "%"' if is_first_letter else '"%" || ? || "%"'} AND lang = ?; """

GET_TRANSLATE_AND_TRANSCRIPTION_BY_DEUTSCH_WORD = lambda is_word_part, is_first_letter=False: f""" SELECT translate, transcription FROM 
{config.WORDS_TABLE_NAME} WHERE original LIKE {'?' if not is_word_part else '? || "%"' if is_first_letter else '"%" || ? || "%"'} AND lang = ?; """

GET_TRANSLATE_AND_TRANSCRIPTION_BY_RUSSIAN_WORD = lambda is_word_part, is_first_letter=False: f""" SELECT original, transcription FROM 
{config.WORDS_TABLE_NAME} WHERE translate LIKE {'?' if not is_word_part else '? || "%"' if is_first_letter else '"%" || ? || "%"'} AND lang = ?;"""

GET_DICTIONARIES = f""" SELECT DISTINCT lang FROM {config.WORDS_TABLE_NAME}; """

GET_WORD_FULL_INFO_BY_WORD = lambda field : f""" SELECT * FROM {config.WORDS_TABLE_NAME} WHERE {field} = ? AND lang = ?; """

GET_WORDS_AMOUNT_BY_ORIGINAL_WORD = f""" SELECT COUNT(*) FROM {config.WORDS_TABLE_NAME} WHERE lang = ? AND original = ?; """

# GET_ALL_WORDS_INFO_FOR_GUESS_GAME = f'SELECT original, translate, transcription, lang, date_to_add FROM {config.TABLE_NAME};'

GET_WORDS_OF_CONCRETE_LANG_INFO_FOR_GUESS_GAME = f""" SELECT original, translate, transcription, lang, date_to_add, is_forgotten, id FROM {config.WORDS_TABLE_NAME} WHERE lang = ?; """

SET_ALL_WORDS_IS_FORGOTTEN_NO = f""" UPDATE {config.WORDS_TABLE_NAME} SET is_forgotten = false WHERE lang = ?; """

SET_IS_FORGOTTEN_YES = f""" UPDATE {config.WORDS_TABLE_NAME} SET is_forgotten = true WHERE id = ?; """