from typing import Union
from enum import Enum


class ForeignLang(Enum):
	EN = 'Английский'
	DE = 'Немецкий'
	IT = 'Итальянский'
	UK = 'Украинский'
	EO = 'Эсперанто'

	@staticmethod
	def get_lang_by_code(code: str, word_end=None) -> Union[str, None]:
		for _lang in ForeignLang:
			if code == _lang.name:
				val = _lang.value
				return val if word_end is None else (val[:-len(word_end)] + word_end) if val.endswith('кий') else val
		return None

	@staticmethod
	def get_code_by_lang(lang: str) -> Union[str, None]:
		for _lang in ForeignLang:
			if lang == _lang.value:
				return _lang.name
		return None
