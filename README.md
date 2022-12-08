# AWS Multiple Accounts Extension

If you use multiple AWS Accounts via the SSO dashboard at *.awsapp.com you may have noticed that after you select an account a new tab is opened but there is no immediate way of knowing in which account you are logged in, you only get the account id.

This extension solves this. It will automatically get all the accounts available in *.awsapp.com and once you are in *.aws.amazon.com it will prepend the account name to your role.

![Step 1](https://github.com/streaver/aws-multiple-accounts-extension/blob/main/images/step1.png?raw=true)
![Step 2](https://github.com/streaver/aws-multiple-accounts-extension/blob/main/images/step2.png?raw=true)
![Step 3](https://github.com/streaver/aws-multiple-accounts-extension/blob/main/images/step3.png?raw=true)
![Step 4](https://github.com/streaver/aws-multiple-accounts-extension/blob/main/images/step4.png?raw=true)
# Installing

We are not publishing this to the extension store un purpose. We want to make sure whoever uses this extension knows what they are doing. You can download the zip file with the extension code or you can build it yourself if you don't trust the maintainers, we won't be offended.

## Option 1

1. Download the zip form the [releases page](https://github.com/streaver/aws-multiple-accounts-extension/releases).
2. Extract the zip file into a folder.
2. Go to `chrome://extensions/`
3. Click on "Load unpacked"
4. Select the folder.
5. Reload the AWS SSO page.

## Option 2

0. Because you don't trust the maintainers, you will need to review the code 😅.
1. Clone the repo `git clone git@github.com:streaver/aws-multiple-accounts-extension.git`
2. Install dependencies `npm install`
3. Build it `npm run build`
4. Go to `chrome://extensions/`
5. Click on "Load unpacked"
6. Select the folder.
7. Reload the AWS SSO page.

# Development

1. Clone the repo `git clone git@github.com:streaver/aws-multiple-accounts-extension.git`
2. Install dependencies `npm install`
3. Build it `npm run dev`
4. Each time you change things go the `chrome://extensions` page an reload the extension

# Testing

```
npm run test
```
# Formatting

```
npm run prettier
```

# Building

```
npm run build
```

# About

This extension was built with ❤️ by [Streaver](https://github.com/streaver). Reach out to us if you need DevOps help or just to say hi!
