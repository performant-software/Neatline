module.exports = {
    options: {
        text_domain: 'Neatline',
        dest: 'languages/',
        overwrite: true,
        encoding: 'UTF-8',
        language: 'PHP',
        keywords: ['__'],
        omit_header: true
    },

    files: {
        src: [
            '*.php',
            'assertions/*.php',
            'assertions/**/*.php',
            'controllers/*.php',
            'controllers/**/*.php',
            'forms/*.php',
            'forms/**/*.php',
            'helpers/*.php',
            'helpers/**/*.php',
            'jobs/*.php',
            'jobs/**/*.php',
            'models/*.php',
            'models/**/*.php',
            'views/*.php',
            'views/**/*.php'
        ],
        expand: true
    }
};
