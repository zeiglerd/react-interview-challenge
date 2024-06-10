# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2024-06-10

### Added

- Added environmental variables:
    - `REACT_APP_DEPOSIT_MAX_TRANSACTION`
    - `REACT_APP_WITHDRAW_MAX_TRANSACTION`
    - `REACT_APP_WITHDRAW_MAX_DAILY`
    - `REACT_APP_WITHDRAW_DIVISIBLE`
- Added conditions for deposit:
    - A customer cannot deposit more than $1000 in a single transaction.
    - If this is a credit account, the customer cannot deposit more in their account than is needed to 0 out the account.
- Added conditions for withdraw:
    - A customer can withdraw no more than $200 in a single transaction.
    - A customer can withdraw no more than $400 in a single day.
    - A customer can withdraw any amount that can be dispensed in $5 bills.
    - The customer cannot withdraw more than they have in their account, unless it is a credit account, in which case they cannot withdraw more than their credit limit.
- Added MaterialUI's List, ListItem, and ListItemText and used them to raise errors for failing transaction conditions.
