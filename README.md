# AWS Multiple Accounts

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

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
