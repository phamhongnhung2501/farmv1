const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'testsmtpmail.h1@gmail.com',
        pass: 'gqtngdjxooiyvgmt'
    }
});

const handlebarOptions = {
    viewEngine: {
        partialsDir: 'src/controllers/base/statics/emails/',
        layoutsDir: 'src/controllers/base/statics/emails/',
        defaultLayout: null,
    },
    viewPath: 'src/controllers/base/statics/emails',
};

transport.use('compile', hbs(handlebarOptions));

const send = (to_email, template, context, done) => {
    const email = {
        from: 'testsmtpmail.h1@gmail.com',
        to: to_email,
        subject: 'Test mail',
        template: template,
        context: context
    };

    transport.sendMail(email, (err, msg) => {
        if(err) { return done(err);}
        return done(null, msg);
    });
};

module.exports = {
    transport,
    send
};
