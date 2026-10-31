import ast
from app.schemas import Issue, SeverityEnum


def check_unreachable(statements, issues):
    """Détecte les instructions après return ou raise, même dans les blocs imbriqués."""
    
    for index, statement in enumerate(statements):
        if isinstance(statement, (ast.Return, ast.Raise)):
            if index + 1 < len(statements):
                next_statement = statements[index + 1]
                issues.append(
                    Issue(
                        rule_id="PY_UNREACHABLE",
                        type="UnreachableCode",
                        line=next_statement.lineno,
                        severity=SeverityEnum.MEDIUM,
                        message="Cette instruction ne sera jamais exécutée."
                    )
                )
            break  # On arrête de vérifier ce bloc après un return/raise

        # Explorer les blocs conditionnels et les boucles
        if isinstance(statement, (ast.If, ast.For, ast.AsyncFor, ast.While)):
            check_unreachable(statement.body, issues)
            check_unreachable(statement.orelse, issues)

        elif isinstance(statement, (ast.With, ast.AsyncWith)):
            check_unreachable(statement.body, issues)

        elif isinstance(statement, (ast.Try, getattr(ast, "TryStar", ast.Try))):
            check_unreachable(statement.body, issues)
            check_unreachable(statement.orelse, issues)
            check_unreachable(statement.finalbody, issues)

            for handler in statement.handlers:
                check_unreachable(handler.body, issues)

        elif isinstance(statement, ast.Match):
            for case in statement.cases:
                check_unreachable(case.body, issues)


def analyze_python_code(source_code: str):
    """Analyse le code Python et détecte plusieurs problèmes statiques."""

    issues = []

    # 1. Vérifier la syntaxe
    try:
        tree = ast.parse(source_code)

    except SyntaxError as error:
        issues.append(
            Issue(
                rule_id="PY_SYNTAX",
                type="SyntaxError",
                line=error.lineno,
                severity=SeverityEnum.CRITICAL,
                message=f"Erreur de syntaxe : {error.msg}"
            )
        )
        return {
            "status": "error",
            "valid": False,
            "issues": issues,
            "summary": "Le code contient une erreur de syntaxe."
        }

    # 2. Parcourir les nœuds de l'arbre AST
    for node in ast.walk(tree):

        # Règle 1 : division par zéro explicite
        if isinstance(node, ast.BinOp) and isinstance(node.op, ast.Div):
            if (
                isinstance(node.right, ast.Constant)
                and isinstance(node.right.value, (int, float))
                and not isinstance(node.right.value, bool)
                and node.right.value == 0
            ):
                issues.append(
                    Issue(
                        rule_id="PY_DIV_ZERO",
                        type="PotentialZeroDivision",
                        line=node.lineno,
                        severity=SeverityEnum.HIGH,
                        message="Division par zéro détectée."
                    )
                )

        # Règle 2 : comparaison avec 'is' sur une constante
        if isinstance(node, ast.Compare):
            comparisons = [node.left] + node.comparators

            for operator, value in zip(node.ops, comparisons[1:]):
                if (
                    isinstance(operator, (ast.Is, ast.IsNot))
                    and isinstance(value, ast.Constant)
                    and value.value is not None
                ):
                    issues.append(
                        Issue(
                            rule_id="PY_IS_LITERAL",
                            type="SuspiciousIdentityComparison",
                            line=node.lineno,
                            severity=SeverityEnum.MEDIUM,
                            message=(
                                "Utilisez '==' ou '!=' pour comparer "
                                "des valeurs plutôt que 'is' ou 'is not'."
                            )
                        )
                    )
                    break

        # Règle 3 : valeurs mutables comme paramètres par défaut
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            defaults = node.args.defaults + [
                default for default in node.args.kw_defaults
                if default is not None
            ]

            for default in defaults:
                if isinstance(default, (ast.List, ast.Dict, ast.Set)):
                    issues.append(
                        Issue(
                            rule_id="PY_MUTABLE_DEFAULT",
                            type="MutableDefaultArgument",
                            line=default.lineno,
                            severity=SeverityEnum.MEDIUM,
                            message=(
                                "Évitez les listes, dictionnaires ou ensembles "
                                "mutables comme valeurs par défaut. "
                                "Utilisez None et initialisez la valeur dans la fonction."
                            )
                        )
                    )
            
            # Règle 4 : code inaccessible (on utilise la nouvelle fonction)
            check_unreachable(node.body, issues)

    # 3. Construire le résumé
    summary = (
        f"{len(issues)} problème(s) détecté(s)."
        if issues
        else "Aucun problème détecté par les règles actuelles."
    )

    return {
        "status": "success",
        "valid": True,
        "issues": issues,
        "summary": summary
    }