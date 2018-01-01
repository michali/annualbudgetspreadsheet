# Annual Budget Spreadsheet
Scripts to calculate expenses and income for the Annual Budget Google Sheets worksheet.

This project enhances the functionality of the already good Annual Budget script offered by the Google Sheets Gallery.

Every night between 12 and 1 am local time, a trigger is fired to do the following:
- Read through a new tab called Categories where a user can add/edit/remove spending category groups and categories.
- Lay down tables for each category group and category in the Expenses tab.
- Read through recurring transactions from a new tab called Recurring push a transacction for each eligible recurring transaction into a new tab called Transactions.
- Read through the Transactions tab where the user logs daily transactions.
- Calculate the sum for each category and push into the newly created tables in the expenses tab.
- Calculate the sum for pay slip income for every month in the year and push that into the Payslip category in the Income tab.

### Limitations / issues
- The categories in the categories tab have no unique identifier against them, parsing and adding transaction to Expenses is done by text comparison, so it's important that categories in column B in Categories tab have unique names.
- The only income that the script calculates is payslips. Anything else has to be filled manually in the Income tab in the rows below Payslip.


https://docs.google.com/spreadsheets/d/1yknarRveldkbWaCKKOISeF6ZO_CbtFTYSyPvIFAMNqI/copy
