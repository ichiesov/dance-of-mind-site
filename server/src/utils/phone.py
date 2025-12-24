import phonenumbers


def to_e164(raw: str) -> str:
    parsed = phonenumbers.parse(raw, "RU")
    e164 = phonenumbers.format_number(parsed, phonenumbers.PhoneNumberFormat.E164)
    return e164