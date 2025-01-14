import marimo

__generated_with = "0.10.12"
app = marimo.App(width="medium")


@app.cell
def _():
    import marimo as mo
    return (mo,)


@app.cell
def _(mo):
    mo.md("""# About""")
    return


@app.cell
def _(mo):
    from logic import get_myname

    mo.md(f"""- My name is {get_myname()}.""")
    return (get_myname,)


if __name__ == "__main__":
    app.run()
