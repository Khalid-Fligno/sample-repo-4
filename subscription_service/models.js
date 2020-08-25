class ErrorDetails {
    title = '';
    message = '';
    errorCode = undefined; // 101: User Not Found
}
exports.ErrorDetails = ErrorDetails;

class SubscriptionDetails {
    error = undefined;
    expiry = undefined;
    receipt = undefined;
    originalPurchaseDate = undefined;
    originalTransactionId = undefined;
    productId = undefined;
}
exports.SubscriptionDetails = SubscriptionDetails;

class UnknownError extends ErrorDetails {
    constructor() {
        super();
        this.title = 'Unknown';
        this.message = 'Something went wrong';
        this.errorCode = 101;
    }
}
exports.UnknownError = UnknownError;

class UserNotFoundError extends ErrorDetails{
    constructor() {
        super();
        this.title = 'User not found';
        this.message = 'Account data could not be found';
        this.errorCode = 101;
    }
}
exports.UserNotFoundError = UserNotFoundError;

class SubscriptionNotFoundError extends ErrorDetails {
    constructor() {
        super();
        this.title = 'Subscription not found';
        this.message = 'User has not subscribed to any package';
        this.errorCode = 121;
    }
}
exports.SubscriptionNotFoundError = SubscriptionNotFoundError;

class SubscriptionExpiredError extends ErrorDetails {
    constructor() {
        super();
        this.title = 'Expired';
        this.message = 'Your most recent subscription has expired';
        this.errorCode = 122;
    }
}
exports.SubscriptionExpiredError = SubscriptionExpiredError;

class UnableToRetriveSubscriptionError extends ErrorDetails {
    constructor() {
        super();
        this.title = 'Error';
        this.message = 'Could not retrieve subscription information';
        this.errorCode = 123;
    }
}
exports.UnableToRetriveSubscriptionError = UnableToRetriveSubscriptionError;

class AndroidTokenNotValidError extends ErrorDetails {
    constructor() {
        super();
        this.title = 'invalid token';
        this.message = 'Unable to retrieve the android token';
        this.errorCode = 141;
    }
}
exports.AndroidTokenNotValidError = AndroidTokenNotValidError;


exports.dynamicSort = (property) => {
    var sortOrder = 1;
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a, b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}