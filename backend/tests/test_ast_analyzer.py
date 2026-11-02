
from app.services.ast_analyzer import analyze_python_code


def test_valid_code():
    code = """
def add(a, b):
    return a + b
"""
    result = analyze_python_code(code)

    assert result["valid"] is True
    assert result["status"] == "success"
    assert len(result["issues"]) == 0


def test_syntax_error():
    code = "def add(a, b)"
    result = analyze_python_code(code)

    assert result["valid"] is False
    assert result["status"] == "error"
    assert result["issues"][0].rule_id == "PY_SYNTAX"


def test_division_by_zero():
    code = """
def divide(a):
    return a / 0
"""
    result = analyze_python_code(code)

    assert any(
        issue.rule_id == "PY_DIV_ZERO"
        for issue in result["issues"]
    )


def test_mutable_default():
    code = """
def add_item(item, items=[]):
    items.append(item)
    return items
"""
    result = analyze_python_code(code)

    assert any(
        issue.rule_id == "PY_MUTABLE_DEFAULT"
        for issue in result["issues"]
    )


def test_identity_comparison():
    code = """
def check(x):
    return x is 5
"""
    result = analyze_python_code(code)

    assert any(
        issue.rule_id == "PY_IS_LITERAL"
        for issue in result["issues"]
    )


def test_unreachable_code():
    code = """
def example():
    return 10
    print("Unreachable")
"""
    result = analyze_python_code(code)

    assert any(
        issue.rule_id == "PY_UNREACHABLE"
        for issue in result["issues"]
    )
