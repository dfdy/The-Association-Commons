Custom plugins written for this project must use a display name beginning with `TAC: ` in their `blueprints.yaml`. Quote the YAML name because it contains a colon. This convention applies to first-party plugins, not upstream dependencies.

All first-party plugin versions must match the main project version (currently `0.1.2`). Set their `author.name` to `The Associations Commons (TAC)`. Do not change upstream dependency versions to match the project.
