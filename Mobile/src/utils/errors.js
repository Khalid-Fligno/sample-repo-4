const errors = {
  createUser: {
    'auth/email-already-in-use': 'There is already an account associated with this email address',
    'auth/invalid-email': 'Please enter a valid email',
    'auth/operation-not-allowed': 'Something went wrong. Please contact support',
    'auth/weak-password': 'Please enter a stronger password',
  },
  login: {
    'auth/invalid-email': 'Please enter a valid email',
    'auth/user-disabled': 'Your account has been disabled',
    'auth/user-not-found': 'No account exists for this email',
    'auth/wrong-password': 'Incorrect password',
  },
};

export default errors;
