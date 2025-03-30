from typing import Union
from enum import Enum


class ForeignLang(Enum):
	EN = 'Английский'
	DE = 'Немецкий'

	@staticmethod
	def get_lang_by_code(code: str) -> Union[str, None]:
		for _lang in ForeignLang:
			if code == _lang.name:
				return _lang.value
		return None

	@staticmethod
	def get_code_by_lang(lang: str) -> Union[str, None]:
		for _lang in ForeignLang:
			if lang == _lang.value:
				return _lang.name
		return None
