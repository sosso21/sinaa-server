module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/client/test',
        handler: 'client.test',
      },
      {
        method: 'POST',
        path:"/client/signup",
        handler: 'client.signup',
      },
      {
        method: 'POST',
        path: '/client/connect',
        handler: 'client.connect',
      },
      {
        method: 'GET',
        path: '/confirmEmail/:token',
        handler: 'client.confirmEmailGet',
      },
      {
        method: 'GET',
        path: '/sendMeEmailConfirmation/:langNEmail',
        handler: 'client.sendEmailToConfirm',
      },
      {
        method: 'GET',
        path: '/sendEmailToResetPwd/:langNEmail',
        handler: 'client.sendEmailToResetPassword',
      } ,
      {
        method: 'POST',
        path: '/resetPasswordForget',
        handler: 'client.resetForgetPassword',
      } ,
      {
        method: 'POST',
        path: '/changeUserInfo',
        handler: 'client.changeUserInfo',
      },
      {
        method: 'POST',
        path: '/EditEmail',
        handler: 'client.EditEmail',
      }
    ], 
  };