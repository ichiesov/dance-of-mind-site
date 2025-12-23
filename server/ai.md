# AI Development Guidelines for Python 3.14

> **Версия**: 1.0  
> **Python версия**: 3.14  
> **Дата обновления**: December 2024  
> **Целевой агент**: Claude Code

---

## 📋 Содержание

1. [Обзор проекта](#обзор-проекта)
2. [Структура проекта](#структура-проекта)
3. [Принципы разработки](#принципы-разработки)
4. [Стандарты кода](#стандарты-кода)
5. [Методы и паттерны](#методы-и-паттерны)
6. [Тестирование](#тестирование)
7. [Команды и инструменты](#команды-и-инструменты)
8. [Приоритеты использования](#приоритеты-использования)
9. [Антипаттерны](#антипаттерны)
10. [Безопасность и разрешения](#безопасность-и-разрешения)

---

## 🎯 Обзор проекта

### Основная информация
- **Язык**: Python 3.14
- **Парадигма**: Преимущественно функциональное и процедурное программирование
- **Менеджер пакетов**: `pip` с `requirements.txt` или `pyproject.toml`
- **Форматтер**: `black` + `isort`
- **Линтер**: `ruff` или `pylint`
- **Типизация**: Строгая типизация с `mypy`

### Цели кодовой базы
- Читаемость и поддерживаемость кода
- Производительность и эффективность
- Безопасность и надежность
- Простота тестирования
- Модульность и переиспользуемость

---

## 📁 Структура проекта

```
project/
├── src/                      # Исходный код приложения
│   ├── __init__.py
│   ├── core/                 # Основная бизнес-логика
│   │   ├── __init__.py
│   │   ├── models/          # Модели данных (dataclasses)
│   │   ├── services/        # Бизнес-сервисы
│   │   └── utils/           # Вспомогательные утилиты
│   ├── api/                  # API endpoints (если есть)
│   │   ├── __init__.py
│   │   └── routes/
│   ├── data/                 # Обработка данных
│   │   ├── __init__.py
│   │   ├── loaders/         # Загрузчики данных
│   │   ├── processors/      # Обработчики
│   │   └── validators/      # Валидаторы
│   └── config/              # Конфигурационные файлы
│       ├── __init__.py
│       └── settings.py
├── tests/                    # Тесты
│   ├── unit/
│   ├── integration/
│   └── conftest.py
├── data/                     # Данные проекта (не в git)
│   ├── raw/
│   ├── processed/
│   └── external/
├── models/                   # Сохраненные модели ML (если есть)
├── notebooks/                # Jupyter notebooks для экспериментов
├── docs/                     # Документация
├── scripts/                  # Скрипты для автоматизации
├── .github/                  # CI/CD конфигурация
│   └── workflows/
├── pyproject.toml           # Конфигурация проекта и зависимостей
├── requirements.txt         # Зависимости для production
├── requirements-dev.txt     # Зависимости для разработки
├── .env.example            # Пример переменных окружения
├── README.md               # Документация проекта
└── AI.md                   # Этот файл

```

### Принципы организации
- Один модуль = одна ответственность
- Максимум 500 строк на файл (рекомендация)
- Логическая группировка связанных функций
- Избегайте глубокой вложенности (макс. 3 уровня)

---

## 🎨 Принципы разработки

### Основные принципы

1. **KISS (Keep It Simple, Stupid)**
   - Предпочитайте простые решения сложным
   - Избегайте преждевременной оптимизации
   - Код должен быть понятен без комментариев

2. **DRY (Don't Repeat Yourself)**
   - Извлекайте повторяющийся код в функции
   - Используйте переменные для констант
   - Создавайте переиспользуемые модули

3. **YAGNI (You Aren't Gonna Need It)**
   - Не добавляйте функциональность "на будущее"
   - Реализуйте только текущие требования
   - Рефакторьте при необходимости изменений

4. **Separation of Concerns**
   - Разделяйте бизнес-логику и представление
   - Изолируйте слои приложения
   - Используйте dependency injection

5. **Fail Fast**
   - Валидируйте входные данные рано
   - Используйте явные исключения
   - Не скрывайте ошибки

---

## 📝 Стандарты кода

### Стиль кода (PEP 8 + расширения)

```python
# ХОРОШО: Используйте type hints везде
from typing import Optional, List, Dict, Union
from dataclasses import dataclass
from datetime import datetime

def process_user_data(
    user_id: int,
    name: str,
    email: Optional[str] = None,
    created_at: Optional[datetime] = None
) -> Dict[str, Union[str, int]]:
    """
    Обработка пользовательских данных.
    
    Args:
        user_id: Уникальный идентификатор пользователя
        name: Полное имя пользователя
        email: Email адрес (опционально)
        created_at: Дата создания записи
        
    Returns:
        Словарь с обработанными данными пользователя
        
    Raises:
        ValueError: Если user_id <= 0
    """
    if user_id <= 0:
        raise ValueError("user_id должен быть положительным числом")
    
    return {
        "id": user_id,
        "name": name.strip(),
        "email": email or "not_provided@example.com"
    }
```

### Именование (PEP 8)

```python
# Переменные и функции: snake_case
user_count = 10
def calculate_total_price() -> float: ...

# Классы: PascalCase
class UserManager: ...
class DataProcessor: ...

# Константы: UPPER_SNAKE_CASE
MAX_CONNECTIONS = 100
API_BASE_URL = "https://api.example.com"

# Приватные атрибуты: _leading_underscore
class MyClass:
    def __init__(self):
        self._internal_state = []
        
# Модули: lowercase без подчеркиваний (если короткие) или snake_case
# data_loader.py, config.py, userauth.py
```

### Type Hints (обязательно для Python 3.14)

```python
from typing import TypeAlias, Protocol, TypeVar, Generic
from collections.abc import Sequence, Mapping

# ХОРОШО: Используйте современный синтаксис Python 3.14
def greet(name: str) -> str:
    return f"Hello, {name}!"

# ХОРОШО: Type aliases для сложных типов
UserId: TypeAlias = int
UserData: TypeAlias = dict[str, str | int]

# ХОРОШО: Используйте Protocol для структурной типизации
class Drawable(Protocol):
    def draw(self) -> None: ...

# ХОРОШО: Generic types
T = TypeVar('T')
def first(items: Sequence[T]) -> T | None:
    return items[0] if items else None
```

### Импорты

```python
# Порядок импортов (разделенных пустой строкой):
# 1. Стандартная библиотека
import os
import sys
from pathlib import Path
from typing import Optional

# 2. Сторонние библиотеки
import numpy as np
import pandas as pd
from pydantic import BaseModel

# 3. Локальные импорты
from src.core.models import User
from src.core.services import AuthService
from src.utils import logger

# ПЛОХО: Избегайте wildcard импортов
# from module import *

# ХОРОШО: Явные импорты
from math import sqrt, pi, ceil

# ХОРОШО: Для длинных списков используйте скобки
from src.core.models import (
    User,
    Product,
    Order,
    Payment,
    Invoice,
)
```

### Docstrings (Google Style)

```python
def complex_function(
    param1: int,
    param2: str,
    param3: Optional[list[str]] = None
) -> dict[str, any]:
    """
    Краткое описание функции в одну строку.
    
    Более подробное описание функции, если необходимо.
    Может занимать несколько строк и описывать детали
    реализации или особенности использования.
    
    Args:
        param1: Описание первого параметра
        param2: Описание второго параметра
        param3: Описание третьего параметра (опционально)
            Может быть многострочным
            
    Returns:
        Описание возвращаемого значения
        
    Raises:
        ValueError: Когда param1 отрицательное число
        TypeError: Когда param2 не строка
        
    Example:
        >>> result = complex_function(42, "test")
        >>> print(result)
        {'status': 'success', 'data': ...}
    """
    pass
```

### Форматирование строк

```python
# ХОРОШО: F-strings (предпочтительно в Python 3.14)
name = "Alice"
age = 30
message = f"User {name} is {age} years old"

# ХОРОШО: T-strings для интернационализации (Python 3.14+)
# from typing import t
# message = t"User {name} is {age} years old"

# ПЛОХО: Старый % formatting
# message = "User %s is %d years old" % (name, age)

# ПЛОХО: str.format() (устарело)
# message = "User {} is {} years old".format(name, age)

# ХОРОШО: Многострочные f-strings
query = f"""
    SELECT *
    FROM users
    WHERE name = '{name}'
    AND age > {age}
"""
```

---

## 🔧 Методы и паттерны

### Работа с данными

```python
from dataclasses import dataclass, field
from typing import ClassVar

# ХОРОШО: Используйте dataclasses для структур данных
@dataclass(frozen=True)  # immutable для безопасности
class User:
    """Модель пользователя (неизменяемая)."""
    id: int
    name: str
    email: str
    is_active: bool = True
    
    def __post_init__(self):
        """Валидация после инициализации."""
        if not self.email or '@' not in self.email:
            raise ValueError("Invalid email format")

@dataclass
class Config:
    """Конфигурация приложения."""
    api_key: str
    timeout: int = 30
    retries: int = 3
    endpoints: list[str] = field(default_factory=list)
    
    # Class variable для shared state
    MAX_TIMEOUT: ClassVar[int] = 300
```

### Работа с файлами

```python
from pathlib import Path
import json

# ХОРОШО: Всегда используйте context managers
def read_json_file(filepath: Path) -> dict:
    """Чтение JSON файла."""
    with filepath.open('r', encoding='utf-8') as f:
        return json.load(f)

def write_json_file(filepath: Path, data: dict) -> None:
    """Запись JSON файла."""
    with filepath.open('w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

# ХОРОШО: Используйте pathlib вместо os.path
def process_data_directory(data_dir: Path) -> list[Path]:
    """Обработка всех JSON файлов в директории."""
    return list(data_dir.glob('*.json'))

# ПЛОХО: Не используйте строки для путей
# def read_file(filepath: str): ...
```

### Обработка ошибок

```python
import logging
from typing import Optional

logger = logging.getLogger(__name__)

# ХОРОШО: Специфичные исключения
class ValidationError(Exception):
    """Ошибка валидации данных."""
    pass

class DataNotFoundError(Exception):
    """Данные не найдены."""
    pass

# ХОРОШО: EAFP (Easier to Ask for Forgiveness than Permission)
def get_user_age(user_data: dict) -> int:
    """Получение возраста пользователя."""
    try:
        return int(user_data['age'])
    except KeyError:
        logger.warning("Age not found in user data")
        raise DataNotFoundError("User age is missing")
    except (ValueError, TypeError) as e:
        logger.error(f"Invalid age format: {e}")
        raise ValidationError(f"Invalid age value: {user_data.get('age')}")

# ПЛОХО: LBYL (Look Before You Leap) - избегайте
def get_user_age_bad(user_data: dict) -> int:
    if 'age' in user_data:
        if isinstance(user_data['age'], (int, str)):
            try:
                return int(user_data['age'])
            except:
                return 0
    return 0
```

### Логирование

```python
import logging
from datetime import datetime, timezone

# ХОРОШО: Structured logging с контекстом
def setup_logging(log_level: str = "INFO") -> None:
    """Настройка логирования."""
    logging.basicConfig(
        level=getattr(logging, log_level.upper()),
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )

logger = logging.getLogger(__name__)

def process_payment(amount: float, user_id: int) -> bool:
    """Обработка платежа."""
    logger.info(
        "Processing payment",
        extra={
            'user_id': user_id,
            'amount': amount,
            'timestamp': datetime.now(timezone.utc).isoformat()
        }
    )
    
    try:
        # Payment logic here
        result = True
        logger.info(f"Payment successful for user {user_id}")
        return result
    except Exception as e:
        logger.error(
            f"Payment failed for user {user_id}",
            exc_info=True  # Включает stack trace
        )
        raise

# ПЛОХО: Не используйте print() в production коде
# print(f"Processing payment for {user_id}")
```

### Работа со временем

```python
from datetime import datetime, timezone, timedelta
from zoneinfo import ZoneInfo  # Python 3.9+

# ХОРОШО: Всегда используйте timezone-aware datetime
def create_timestamp() -> datetime:
    """Создание timestamp в UTC."""
    return datetime.now(timezone.utc)

def parse_datetime(date_string: str) -> datetime:
    """Парсинг строки даты в UTC."""
    dt = datetime.fromisoformat(date_string)
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt

def convert_timezone(dt: datetime, tz_name: str) -> datetime:
    """Конвертация datetime в другой timezone."""
    target_tz = ZoneInfo(tz_name)
    return dt.astimezone(target_tz)

# ПЛОХО: Naive datetime (без timezone)
# now = datetime.now()  # Избегайте!

# ХОРОШО: Добавление времени
future = datetime.now(timezone.utc) + timedelta(days=7, hours=3)
```

### Функциональное программирование

```python
from typing import Callable, Iterable
from functools import reduce
from itertools import islice

# ХОРОШО: Используйте comprehensions
numbers = [1, 2, 3, 4, 5]
squares = [x**2 for x in numbers]
even_squares = [x**2 for x in numbers if x % 2 == 0]

# ХОРОШО: Generator expressions для больших данных
huge_numbers = range(1_000_000)
squares_gen = (x**2 for x in huge_numbers if x % 2 == 0)

# ХОРОШО: Используйте встроенные функции
total = sum(numbers)
maximum = max(numbers)
filtered = list(filter(lambda x: x > 2, numbers))
transformed = list(map(lambda x: x * 2, numbers))

# ХОРОШО: functools.reduce для агрегации
product = reduce(lambda x, y: x * y, numbers, 1)

# ХОРОШО: Ленивая обработка больших данных
def process_large_file(filepath: Path) -> Iterable[str]:
    """Ленивая обработка больших файлов."""
    with filepath.open('r') as f:
        for line in f:
            yield line.strip().upper()

# ХОРОШО: Композиция функций
def compose(*functions: Callable) -> Callable:
    """Композиция функций."""
    def inner(arg):
        result = arg
        for func in reversed(functions):
            result = func(result)
        return result
    return inner

double = lambda x: x * 2
add_ten = lambda x: x + 10
process = compose(double, add_ten)  # (x + 10) * 2
```

### Async/Await

```python
import asyncio
from typing import AsyncIterator
import aiohttp

# ХОРОШО: Асинхронные функции для I/O операций
async def fetch_data(url: str) -> dict:
    """Асинхронное получение данных."""
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.json()

async def fetch_multiple(urls: list[str]) -> list[dict]:
    """Параллельное получение данных из нескольких URL."""
    tasks = [fetch_data(url) for url in urls]
    return await asyncio.gather(*tasks, return_exceptions=True)

# ХОРОШО: Асинхронные генераторы
async def async_range(count: int) -> AsyncIterator[int]:
    """Асинхронный генератор."""
    for i in range(count):
        await asyncio.sleep(0.1)
        yield i

async def process_stream():
    """Обработка асинхронного потока."""
    async for value in async_range(10):
        print(f"Processed: {value}")

# ХОРОШО: Таймауты для async операций
async def fetch_with_timeout(url: str, timeout: float = 5.0) -> dict:
    """Получение данных с таймаутом."""
    try:
        return await asyncio.wait_for(
            fetch_data(url),
            timeout=timeout
        )
    except asyncio.TimeoutError:
        logger.error(f"Timeout fetching {url}")
        raise
```

---

## 🧪 Тестирование

### Структура тестов

```python
import pytest
from unittest.mock import Mock, patch, MagicMock
from src.core.services import UserService
from src.core.models import User

# ХОРОШО: Arrange-Act-Assert паттерн
def test_user_creation():
    """Тест создания пользователя."""
    # Arrange
    user_data = {
        "name": "John Doe",
        "email": "john@example.com"
    }
    
    # Act
    user = User(**user_data)
    
    # Assert
    assert user.name == "John Doe"
    assert user.email == "john@example.com"
    assert user.is_active is True

# ХОРОШО: Используйте fixtures
@pytest.fixture
def sample_user() -> User:
    """Фикстура для тестового пользователя."""
    return User(
        id=1,
        name="Test User",
        email="test@example.com"
    )

def test_user_service(sample_user):
    """Тест сервиса пользователей."""
    service = UserService()
    result = service.validate_user(sample_user)
    assert result is True

# ХОРОШО: Параметризованные тесты
@pytest.mark.parametrize("email,expected", [
    ("valid@example.com", True),
    ("invalid-email", False),
    ("", False),
    ("no-at-sign.com", False),
])
def test_email_validation(email: str, expected: bool):
    """Тест валидации email."""
    result = validate_email(email)
    assert result == expected

# ХОРОШО: Тестирование исключений
def test_invalid_user_raises_error():
    """Тест генерации исключения при невалидных данных."""
    with pytest.raises(ValueError, match="Invalid email"):
        User(id=1, name="Test", email="invalid")

# ХОРОШО: Мокирование внешних зависимостей
@patch('src.core.services.external_api.get_user')
def test_user_service_with_mock(mock_get_user, sample_user):
    """Тест с мокированием внешнего API."""
    # Arrange
    mock_get_user.return_value = {"id": 1, "status": "active"}
    service = UserService()
    
    # Act
    result = service.fetch_user_status(sample_user.id)
    
    # Assert
    assert result == "active"
    mock_get_user.assert_called_once_with(sample_user.id)
```

### Coverage требования

- Минимальный coverage: **80%**
- Критичные модули: **95%+**
- Все публичные API должны быть покрыты тестами
- Тесты должны быть независимыми и изолированными

---

## ⚙️ Команды и инструменты

### Виртуальное окружение

```bash
# Создание виртуального окружения
python3.14 -m venv .venv

# Активация (Linux/Mac)
source .venv/bin/activate

# Активация (Windows)
.venv\Scripts\activate

# Установка зависимостей
pip install --break-system-packages -r requirements.txt
pip install --break-system-packages -r requirements-dev.txt
```

### Форматирование и линтинг

```bash
# Форматирование кода (одним файлом)
black src/module.py
isort src/module.py

# Форматирование всего проекта
black src/
isort src/

# Линтинг (один файл)
ruff check src/module.py
pylint src/module.py

# Линтинг всего проекта
ruff check src/
pylint src/

# Автоисправление (ruff)
ruff check --fix src/
```

### Проверка типов

```bash
# Проверка типов (один файл)
mypy src/module.py

# Проверка типов всего проекта
mypy src/

# Строгий режим
mypy --strict src/

# С конфигурацией
mypy --config-file pyproject.toml src/
```

### Тестирование

```bash
# Запуск всех тестов
pytest

# Запуск конкретного файла
pytest tests/unit/test_user.py

# Запуск с coverage
pytest --cov=src --cov-report=html --cov-report=term

# Запуск конкретного теста
pytest tests/unit/test_user.py::test_user_creation

# Параллельное выполнение (с pytest-xdist)
pytest -n auto

# Только failed тесты
pytest --lf

# Подробный вывод
pytest -v -s
```

### Pre-commit hooks

```bash
# Установка pre-commit
pip install --break-system-packages pre-commit

# Установка hooks
pre-commit install

# Запуск вручную на всех файлах
pre-commit run --all-files

# Обновление hooks
pre-commit autoupdate
```

### Управление зависимостями

```bash
# Установка пакета
pip install --break-system-packages package_name

# Обновление requirements.txt
pip freeze > requirements.txt

# Проверка уязвимостей
pip-audit

# Обновление устаревших пакетов
pip list --outdated
pip install --break-system-packages --upgrade package_name
```

---

## 🎯 Приоритеты использования

### Порядок решения задач

1. **Читаемость** > Производительность (пока не доказано обратное)
2. **Простота** > Сложность
3. **Явное** > Неявное (Explicit is better than implicit)
4. **Безопасность** > Удобство
5. **Тестируемость** > Элегантность

### Выбор инструментов

#### Структуры данных (по приоритету)

1. **Built-in типы**: `list`, `dict`, `set`, `tuple`
2. **dataclasses**: Для структурированных данных
3. **NamedTuple**: Для immutable структур
4. **Pydantic**: Для валидации данных из внешних источников
5. **Classes**: Только при необходимости сложного поведения

#### Работа с файлами

1. **pathlib.Path** (всегда, вместо `os.path`)
2. **json** для JSON
3. **tomllib** для TOML (read-only, Python 3.11+)
4. **csv** для CSV
5. **pandas** только для больших объемов табличных данных

#### HTTP клиенты

1. **httpx** (современный, async-ready)
2. **aiohttp** (для async)
3. **requests** (legacy, но стабильный)

#### CLI инструменты

1. **typer** (современный, с type hints)
2. **click** (проверенный временем)
3. **argparse** (stdlib, для простых случаев)

### Новые возможности Python 3.14

```python
# Используйте современные возможности Python 3.14:

# 1. Pattern matching (Python 3.10+, улучшено в 3.14)
def process_command(command: dict) -> str:
    match command:
        case {"action": "create", "type": "user", **rest}:
            return f"Creating user with {rest}"
        case {"action": "delete", "id": user_id}:
            return f"Deleting user {user_id}"
        case _:
            return "Unknown command"

# 2. Union types с | (Python 3.10+)
def process(value: int | str | None) -> str:
    match value:
        case int(x):
            return f"Integer: {x}"
        case str(s):
            return f"String: {s}"
        case None:
            return "None value"

# 3. Structural pattern matching
class Point:
    __match_args__ = ('x', 'y')
    def __init__(self, x, y):
        self.x = x
        self.y = y

def location(point: Point) -> str:
    match point:
        case Point(0, 0):
            return "Origin"
        case Point(x, 0):
            return f"On X axis at {x}"
        case Point(0, y):
            return f"On Y axis at {y}"
        case Point(x, y):
            return f"At ({x}, {y})"
```

---

## ❌ Антипаттерны

### Критичные антипаттерны (НИКОГДА не делайте так)

#### 1. Mutable default arguments

```python
# ❌ ПЛОХО: Mutable defaults
def add_item(item, items=[]):
    items.append(item)
    return items

# ✅ ХОРОШО: Используйте None
def add_item(item, items: list | None = None) -> list:
    if items is None:
        items = []
    items.append(item)
    return items
```

#### 2. Bare except

```python
# ❌ ПЛОХО: Catching все исключения
try:
    risky_operation()
except:  # Перехватывает даже KeyboardInterrupt!
    pass

# ✅ ХОРОШО: Конкретные исключения
try:
    risky_operation()
except (ValueError, TypeError) as e:
    logger.error(f"Operation failed: {e}")
    raise
```

#### 3. Модификация списка во время итерации

```python
# ❌ ПЛОХО: Изменение списка в цикле
numbers = [1, 2, 3, 4, 5]
for i, num in enumerate(numbers):
    if num % 2 == 0:
        numbers.pop(i)  # Опасно!

# ✅ ХОРОШО: List comprehension
numbers = [num for num in numbers if num % 2 != 0]

# ✅ ХОРОШО: Создание нового списка
numbers = [1, 2, 3, 4, 5]
odd_numbers = [num for num in numbers if num % 2 != 0]
```

#### 4. Import *

```python
# ❌ ПЛОХО: Wildcard imports
from module import *

# ✅ ХОРОШО: Явные импорты
from module import function1, function2, ClassA
```

#### 5. Сравнение с True/False/None

```python
# ❌ ПЛОХО
if value == True:
    pass

if value == None:
    pass

# ✅ ХОРОШО
if value:
    pass

if value is None:
    pass

if value is not None:
    pass
```

#### 6. Не используйте with для файлов

```python
# ❌ ПЛОХО: Файл может не закрыться
f = open('file.txt', 'r')
data = f.read()
f.close()  # Может не выполниться при ошибке

# ✅ ХОРОШО: Context manager
with open('file.txt', 'r') as f:
    data = f.read()
```

#### 7. Использование global

```python
# ❌ ПЛОХО: Global state
counter = 0

def increment():
    global counter
    counter += 1

# ✅ ХОРОШО: Параметры и возврат значений
def increment(counter: int) -> int:
    return counter + 1
```

#### 8. Изменяемые классовые атрибуты

```python
# ❌ ПЛОХО
class MyClass:
    items = []  # Shared между всеми экземплярами!
    
    def add_item(self, item):
        self.items.append(item)

# ✅ ХОРОШО
class MyClass:
    def __init__(self):
        self.items = []  # Уникальный для каждого экземпляра
    
    def add_item(self, item):
        self.items.append(item)
```

#### 9. Неправильная работа с словарями

```python
# ❌ ПЛОХО: Проверка ключа и получение значения
value = None
if 'key' in my_dict:
    value = my_dict['key']

# ✅ ХОРОШО: Используйте get()
value = my_dict.get('key')
value = my_dict.get('key', 'default_value')

# ❌ ПЛОХО: Создание пустого словаря
my_dict = dict()

# ✅ ХОРОШО: Используйте литерал
my_dict = {}
```

#### 10. Неэффективная конкатенация строк

```python
# ❌ ПЛОХО: Конкатенация в цикле
result = ""
for item in items:
    result += str(item) + ", "

# ✅ ХОРОШО: join()
result = ", ".join(str(item) for item in items)

# ✅ ХОРОШО: f-string для небольшого числа строк
name = "Alice"
age = 30
result = f"{name} is {age} years old"
```

#### 11. Избыточные list comprehensions

```python
# ❌ ПЛОХО: Создание списка когда нужен один элемент
numbers = [1, 2, 3, 4, 5]
result = [n for n in numbers if n > 3][0]

# ✅ ХОРОШО: next() с генератором
result = next(n for n in numbers if n > 3)

# ❌ ПЛОХО: List comprehension для side effects
[print(item) for item in items]

# ✅ ХОРОШО: Обычный цикл
for item in items:
    print(item)
```

#### 12. Игнорирование типов в исключениях

```python
# ❌ ПЛОХО: Слишком широкий except
try:
    value = int(user_input)
except Exception:
    value = 0

# ✅ ХОРОШО: Конкретные типы
try:
    value = int(user_input)
except (ValueError, TypeError):
    value = 0
```

#### 13. Неправильное использование `is`

```python
# ❌ ПЛОХО: is для сравнения значений
if name is "John":  # Работает случайно из-за string interning
    pass

# ✅ ХОРОШО: == для значений, is для identity
if name == "John":
    pass

if value is None:  # Правильно для None, True, False
    pass
```

#### 14. Использование eval() и exec()

```python
# ❌ ПЛОХО: Огромная дыра в безопасности
user_input = "print('hello')"
eval(user_input)

# ✅ ХОРОШО: Используйте безопасные альтернативы
import ast
tree = ast.parse(user_input, mode='eval')
# Или используйте специализированные парсеры
```

#### 15. Неправильные docstrings

```python
# ❌ ПЛОХО: Бесполезный docstring
def add(a, b):
    """This function adds two numbers."""
    return a + b

# ✅ ХОРОШО: Информативный docstring с деталями
def add(a: float, b: float) -> float:
    """
    Складывает два числа с плавающей точкой.
    
    Args:
        a: Первое число
        b: Второе число
        
    Returns:
        Сумма a и b
        
    Example:
        >>> add(2.5, 3.7)
        6.2
    """
    return a + b
```

### Антипаттерны производительности

```python
# ❌ ПЛОХО: Множественные проверки membership в списке
def find_common(list1: list, list2: list) -> list:
    result = []
    for item in list1:
        if item in list2:  # O(n) для каждой проверки!
            result.append(item)
    return result

# ✅ ХОРОШО: Используйте set для O(1) lookup
def find_common(list1: list, list2: list) -> list:
    set2 = set(list2)
    return [item for item in list1 if item in set2]

# ✅ ЕЩЕ ЛУЧШЕ: Set intersection
def find_common(list1: list, list2: list) -> list:
    return list(set(list1) & set(list2))
```

### Антипаттерны читаемости

```python
# ❌ ПЛОХО: Вложенные тернарные операторы
value = a if condition1 else b if condition2 else c if condition3 else d

# ✅ ХОРОШО: if-elif-else
if condition1:
    value = a
elif condition2:
    value = b
elif condition3:
    value = c
else:
    value = d

# ❌ ПЛОХО: Сложные lambda
sorted_items = sorted(items, key=lambda x: (x[1], -x[2], x[0].lower()))

# ✅ ХОРОШО: Именованная функция
def sort_key(item):
    return (item[1], -item[2], item[0].lower())

sorted_items = sorted(items, key=sort_key)
```

---

## 🔒 Безопасность и разрешения

### Разрешено без запроса

Claude Code может выполнять следующие операции без предварительного подтверждения:

- ✅ Чтение файлов и директорий
- ✅ Просмотр структуры проекта
- ✅ Форматирование кода (black, isort)
- ✅ Линтинг (ruff, pylint, mypy)
- ✅ Запуск unit тестов одного файла
- ✅ Создание/модификация файлов в src/
- ✅ Проверка типов отдельных файлов

### Требует подтверждения

Следующие операции требуют явного подтверждения:

- ⚠️ Установка новых пакетов (`pip install`)
- ⚠️ Удаление файлов
- ⚠️ Модификация .gitignore, .env файлов
- ⚠️ Запуск полного test suite
- ⚠️ Изменение файлов конфигурации (pyproject.toml, setup.py)
- ⚠️ Git операции (commit, push, pull)
- ⚠️ Изменение прав доступа (chmod)
- ⚠️ Запуск скриптов из scripts/
- ⚠️ Работа с production данными

### Запрещено

- 🚫 Удаление виртуального окружения
- 🚫 Модификация системных файлов
- 🚫 Выполнение sudo команд
- 🚫 Отправка данных на внешние сервисы без уведомления
- 🚫 Модификация .git/ напрямую

---

## 📚 Дополнительные ресурсы

### Официальная документация
- [Python 3.14 What's New](https://docs.python.org/3.14/whatsnew/3.14.html)
- [PEP 8 Style Guide](https://peps.python.org/pep-0008/)
- [Python Type Hints](https://docs.python.org/3/library/typing.html)

### Инструменты качества кода
- [Black](https://black.readthedocs.io/) - Code formatter
- [Ruff](https://docs.astral.sh/ruff/) - Fast linter
- [mypy](https://mypy.readthedocs.io/) - Static type checker
- [pytest](https://docs.pytest.org/) - Testing framework

### Лучшие практики
- [The Hitchhiker's Guide to Python](https://docs.python-guide.org/)
- [Python Anti-Patterns](https://docs.quantifiedcode.com/python-anti-patterns/)
- [Effective Python](https://effectivepython.com/) (книга)

---

## 🔄 История изменений

### Version 1.0 (December 2024)
- Начальная версия для Python 3.14
- Адаптация под Claude Code
- Добавлены антипаттерны и best practices
- Интеграция с современными инструментами

---

## 📝 Примечания для Claude Code

При работе с этим проектом:

1. **Всегда читайте этот файл перед началом работы**
2. Следуйте принципам в порядке приоритета
3. Используйте type hints везде
4. Пишите тесты для нового кода
5. Проверяйте код линтерами перед commit
6. Логируйте важные операции
7. Валидируйте входные данные
8. Обрабатывайте ошибки явно
9. Документируйте публичные API
10. Спрашивайте при неясности требований

### Workflow для новой функциональности

1. Прочитать соответствующие skill files (если есть)
2. Изучить существующий код
3. Написать тесты (TDD)
4. Реализовать функциональность
5. Запустить тесты и линтеры
6. Отформатировать код
7. Обновить документацию
8. Создать pull request

---

**Помните**: Этот документ - живой. Обновляйте его при изменении практик проекта.