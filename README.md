# Accounting System (Firebase edition)

**Simple bookkeeping for everyone.** Journal, General Ledger and a 10-column Worksheet with automatic totals,
net income and a Balanced check. Runs on **Firebase** (Hosting + Authentication + Firestore): no PHP, no MySQL, no server to manage.

## Members
Fill in your role after the dash. Examples: Front end / Back end / Database / Documentation / Tester / Presenter.

- Jhon Kenneth Amarila - Front end / Back end / Database
- Edrian Cabañero - 
- Frances Ria Jay Cuizon - 
- Johnerie Anero - 
- Marimar Mariñas - 
- Shiela Sel -
- Willyy Semontiza - 

---

## How this app can help you
- **Students:** practice the full accounting cycle (journal, ledger, trial balance, adjusting entries, worksheet) and check your answers right away.
- **Small business owners:** keep simple, organized books without spreadsheets or formulas.
- **Saves time:** totals, adjusted balances, income statement, balance sheet and net income are calculated automatically.
- **Prevents mistakes:** the Balanced / Not balanced badge tells you instantly if debits and credits do not match, and it names the section to check.
- **Easy to learn:** Quick Start examples fill in common transactions, and the built-in ? Guide explains the words in plain language.
- **Easy to fix typos:** change any cell in the Journal, Ledger or Worksheet and everything updates and saves by itself.
- **Private:** each user logs in and sees only their own books.

## What is new in v11
- **Dashboard** tab (first): income, expenses, net income, balanced check, last 5 transactions, income-vs-expenses bar chart and an expense donut chart.
- **Sidebar**: light/dark switch at the top; Undo, Color theme (purple / blue / green), Guide and Log out as round buttons at the bottom.
- **Journal**: compact toolbar with search, date range and Adjusting/Regular filter; transactions are added from the **+ New transaction** window; narrower table; pencil icons show what can be edited; colored tags for account types and Adjusting/Regular.
- **Undo** (button or Ctrl+Z) for posts, edits, deletes, Clear all numbers and Load sample.
- **Export** to CSV, Excel (.xlsx) and **Print / PDF** (choose "Save as PDF" in the print window) from Journal, Ledger, Worksheet, Statements and Accounts.
- **Statements** tab: Income Statement and Balance Sheet built from the worksheet.
- **Accounts** tab: add, rename, change type and delete accounts in one place.

## Project files
    public/index.xml           The whole app (XML/XHTML, no HTML file) (pages, design, calculations, Firebase code)
    public/firebase-config.js  Your Firebase settings  <-- the only file you edit
    firestore.rules            Security rules (each user can only see their own books)
    public/manifest.webmanifest, sw.js, icon-*.png   Make the site installable as an app
    firebase.json              Tells Firebase what to upload
    README.md                  This guide

## Guide 1 - How to use the system
**Golden rule:** every transaction touches two accounts with the same amount. One is debited, one is credited.

**Step 1: Journal (record what happened)**
1. Pick an example from **Quick start**, or fill in the form yourself.
2. Check the date, the short note, the **Debit** account (gets the value) and the **Credit** account (gives the value).
3. Type the **Amount** and press **Post transaction**.
4. Tick **Adjusting entry** only for end-of-period items such as supplies used, insurance expired or depreciation.
5. Made a typo? Change any cell in the list. Press the X to delete a transaction.

**Step 2: General Ledger (see each account)**
Choose an account to see its T-account (debits on the left, credits on the right) and its running balance. You can edit the date, note and amount here too.

**Step 3: Worksheet (the big picture)**
Totals, adjusted balances, the income statement, the balance sheet and net income appear automatically.
Green **Balanced** means debit equals credit in every column. Plain cells can be edited; tinted columns are calculated.
Buttons: **Add account**, **Load sample** (a full month of example books) and **Clear all numbers**.

**What the account types mean**

| Type | Meaning | Goes UP with |
|---|---|---|
| Asset | What you own (Cash, Equipment) | Debit |
| Liability | What you owe (Accounts Payable) | Credit |
| Capital | Owner's investment | Credit |
| Drawing | Owner takes money out | Debit |
| Revenue | Money earned | Credit |
| Expense | Cost of running the business | Debit |

**2-minute practice**
1. Quick start: *Owner invests cash*, amount 50000, Post.
2. Quick start: *Earned income - paid in cash*, amount 20000, Post.
3. Quick start: *Paid salaries*, amount 5000, Post.
4. Ledger: pick Cash. The balance should be 65,000.00 Dr.
5. Worksheet: net income should be 15,000.00 and the badge should be green.



## Tips
- Never share your Google account password. The values in `firebase-config.js` are public by design; the rules protect the data.
- Do not type real or sensitive financial data into a demo copy of the system.
- After making the transaction double check is there is no typo of the transaction and the name and the cash value if 
that the case you can easily edit it by clicking the name or transaction you made.