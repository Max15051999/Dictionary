from collections.abc import Iterable
import sqlite3
from typing import Union, List, Dict

import config


class DB:
	def __init__(self, db_name: str):
		self.__coon = sqlite3.connect(db_name)
		self.__cursor = self.__coon.cursor()
		self.create_table(config.WORDS_TABLE_NAME, config.TABLE_FIELDS)

	def create_table(self, table_name: str, fields: Dict[str, str]):
		fields_str = '( '

		for field_name, field_type in fields.items():
			fields_str += field_name + ' ' + field_type + ', '

		fields_str = fields_str[:len(fields_str) - 2]
		fields_str += ');'

		query = f'CREATE TABLE IF NOT EXISTS {table_name}{fields_str}'
		self.__cursor.execute(query)
		self.__coon.commit()

	def query_execute(self, query: str, params: Union[List[Iterable], tuple] = None, is_ext=False, is_fetch_one=False, is_fetch_all=False):

		if is_ext:
			func = self.__cursor.executemany
		else:
			func = self.__cursor.execute

		if params:
			func(query, params)
		else:
			func(query)

		if is_fetch_one:
			data = self.__cursor.fetchone()
			return data
		elif is_fetch_all:
			data = self.__cursor.fetchall()
			return data
		else:
			self.__coon.commit()

	def __del__(self):
		self.__cursor.close()
		self.__coon.close()