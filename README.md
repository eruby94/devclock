# Devclock

A 100% hackable time tracking tool and built with Node.js.

## Getting Started

1.  Globally install this package: `npm i -g devclock`

2.  Navigate to the root directory of each project you would like to track time on, then run `devclock init`.

## CLI Usage

* `devclock init`

  * Initializes a project for usage with devclock, specifically:

        1. Creates a time sheet associated with each project
        2. Updates your root configuration files accordingly.

  * **Note:** Time sheet files are not gitignored by default so that reports may be batch-generated. It is strongly recommended that you allow for this functionality.

* `devclock in`

  * Creates a new entry in the project time sheet with the current time stamp.

  * Time out will be initially stamped identically to time in, so don't forget to clock out :sunglasses:.

* `devclock out`

  * Updates the latest time sheet entry from the current day

  * In order to minimize discrepancies in time keeping, clocking out will only be successful if your time in falls on the same day as your time out.

  * **Note:** If the command fails, you can always manually edit your time sheet as a last resort.

* `devclock analyze`

  * Extracts information from all time sheets that have been configured with devclock.

  * See below for more information on generating reports...

## Generating Reports

* To keep things as separate (at least for now), this package is only responsible for tracking, and extracting time sheet information in JSON format.

* There is a separate repo to display the information from the reports in a web page, found here:

  * [Devclock UI](https://github.com/eruby94/devclock-ui)

## Contributing

* You are encouraged to fork this repo and make a Pull Request if there is something you would like to change / improve.
