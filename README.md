# Desmos Parser

A simple webpage which parse Desmos mathematical expressions, show its structure by a tree graph and count the number of nodes of the tree.

[Link to webpage](https://graphemecluster.github.io/desmos-parser/)

## Unsupported Features

The following features are currently not supported:

- Points `(x,y)`
- Dot operator `a.b`
- Derivative `d/dx`, `f'(x)`

## Known Issues

Precedences related to `term` are not being handled correctly by [nearley](https://github.com/kach/nearley).
