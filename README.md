# ts-inquisition

expect all the type errors. A simple CLI util to mark all your current TS errors as expected. Useful when you wan to start failing you builds on a new type error while keeping the old ones as is.
Supports `ts` and `tsx` files.

## Usage

Note that it is only tested on code bases formatted with prettier. It won't work correctly on code bases with any other formatting.

```
npx ts-inquisition "src/**"
```

# Errors that will not be expected

- import statement errors. You really should fix those, does not make much sense to silence them.
- spanish inquisition. Nobody expects spanish inquisition.

all other TS errors will be expected and silenced.

## TODO

solve JSX elements
