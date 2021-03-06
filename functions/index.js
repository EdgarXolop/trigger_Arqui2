const functions = require('firebase-functions');
const admin = require('firebase-admin')

admin.initializeApp();

exports.alertaDeArquiDos = functions.database.ref('/ARQUI/estadoAlarma')
.onUpdate((snapshot, context) => {

    var estado = snapshot.after.val();

    admin.database().ref('/ARQUI_LOG/alarma/').push({
        date: new Date().toString(),
        event: "La alarma se ha " + (estado?"activado.":"desactivado.")
    });

    if(estado){

        var topic = 'alarma-ntf';

        var message = {
            notification: {
                title: 'Alerta de seguridad',
                body: 'Se ha detectado actividad en el area.'
            },
            topic: topic
        };

        // Send a message to devices subscribed to the provided topic.
        return admin.messaging().send(message)
        .then((response) => {
            // Response is a message ID string.
            console.log('Successfully sent message:', response);
        })
        .catch((error) => {
            console.log('Error sending message:', error);
        });
    }

    return false
    
});