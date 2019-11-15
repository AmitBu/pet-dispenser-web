import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import config from './FIREBASE_CONF'

class Firebase {
    constructor() {
        this.app = firebase.initializeApp(config);
        this.db = firebase.database(this.app);
    }

    /**
     * Observer on firebase auth status
     * @param callback - (user) => user ? // logged in : // not
     */
    onAuthStatusChange = (callback) => {
        firebase.auth().onAuthStateChanged(callback);
    }

    logout = async () => {
        return firebase.auth().signOut();
    }

    getRef = (path) => this.db.ref(path);

    // TODO: Get dispenser status
    getDispenserData(callback) {
        return this.getRef('/Dispenser').on('value', callback);
    }

    setDispenserData(feed = null, feedAmount = null) {
        let updateObj = { };

        if (feedAmount) { Object.assign(updateObj, { feedAmount }) }
        if (feed !== null) { Object.assign(updateObj, { feed }) }

        return this.getRef('/Dispenser').update(updateObj)
    }

    updateUser = (email, name, extra = {}) => {
        this.getCollectionDoc('users', email).set({
            email,
            name,
            ...extra
            // eventId
        }, { merge: true })
        .then(() => console.log('User write success'))
        .catch((err) => console.error('User write error', err))
    }

    signInFacebook = () => {
        const provider = new firebase.auth.FacebookAuthProvider();

        return firebase.auth().signInWithPopup(provider).then((result) => {
            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            const facebookToken = result.credential.accessToken;
            const {email, displayName} = result.user;
            this.updateUser(email, displayName, { facebookToken });
        }).catch((error) => {
            var errorMessage = error.message;
            // TODO: Replace with logger
            console.error('Facebook login error', errorMessage);
        });
    }
}


export default new Firebase()