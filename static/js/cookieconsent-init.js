// obtain plugin
var cc = initCookieConsent();

// run plugin with your configuration
cc.run({
    current_lang: 'en',
    autoclear_cookies: true,                   // default: false
    page_scripts: true,                        // default: false

    // mode: 'opt-in'                          // default: 'opt-in'; value: 'opt-in' or 'opt-out'
    // delay: 0,                               // default: 0
    // auto_language: null                     // default: null; could also be 'browser' or 'document'
    // autorun: true,                          // default: true
    // force_consent: false,                   // default: false
    // hide_from_bots: true,                   // default: true
    // remove_cookie_tables: false             // default: false
    // cookie_name: 'cc_cookie',               // default: 'cc_cookie'
    // cookie_expiration: 182,                 // default: 182 (days)
    // cookie_necessary_only_expiration: 182   // default: disabled
    cookie_domain: 'cansixt.cat',              // default: current domain
    // cookie_path: '/',                       // default: root
    // cookie_same_site: 'Lax',                // default: 'Lax'
    // use_rfc_cookie: false,                  // default: false
    revision: 0,                               // default: 0

    onFirstAction: function(user_preferences, cookie){
        // callback triggered only once
    },

    onAccept: function (cookie) {
        // ...
    },

    onChange: function (cookie, changed_preferences) {
        // ...
    },

    gui_options: {
        consent_modal: {
            layout: 'box',                 // box/cloud/bar
            position: 'bottom right',      // bottom/middle/top + left/right/center
            transition: 'zoom',            // zoom/slide
            swap_buttons: false            // enable to invert buttons
        },
        settings_modal: {
            layout: 'bar',                 // box/bar
            position: 'right',             // left/right
            transition: 'slide'            // zoom/slide
        }
    },

    languages: {
        'en': {
            consent_modal: {
                title: 'We use cookies!',
                description: 'Hi, this website uses tracking cookies to understand how you interact with it. This will be set only after consent. <button type="button" data-cc="c-settings" class="cc-link">Let me choose</button>',
                revision_message: '<br> Hi, the terms have changed. Please, check again and aceept or reject accordingly, thanks!',
                primary_btn: {
                    text: 'Accept all',
                    role: 'accept_all'              // 'accept_selected' or 'accept_all'
                },
                secondary_btn: {
                    text: 'Reject all',
                    role: 'accept_necessary'        // 'settings' or 'accept_necessary'
                }
            },
            settings_modal: {
                title: 'Cookie preferences',
                save_settings_btn: 'Save settings',
                accept_all_btn: 'Accept all',
                reject_all_btn: 'Reject all',
                close_btn_label: 'Close',
                cookie_table_headers: [
                    {col1: 'Name'},
                    {col2: 'Domain'},
                    {col3: 'Expiration'},
                    {col4: 'Description'}
                ],
                blocks: [
                    {
                        title: 'Cookie usage 📢',
                        description: 'This website https://blog.cansixt.cat uses cookies to help us understand the user experience when users browse our website and also allows us to improve it. You can choose for each category to opt-in/out whenever you want. For more details relative to cookies and other sensitive data, please read the full <a href="/privacy-policy" class="cc-link">privacy policy</a>.'
                        // description: 'I use cookies to ensure the basic functionalities of the website and to enhance your online experience. You can choose for each category to opt-in/out whenever you want. For more details relative to cookies and other sensitive data, please read the full <a href="/privacy-policy" class="cc-link">privacy policy</a>.'
                    },
                    // {
                    //     title: 'Strictly necessary cookies',
                    //     description: 'These cookies are essential for the proper functioning of my website. Without these cookies, the website would not work properly',
                    //     toggle: {
                    //         value: 'necessary',
                    //         enabled: true,
                    //         readonly: true          // cookie categories with readonly=true are all treated as "necessary cookies"
                    //     }
                    // },
                    {
                        title: 'Performance and Analytics cookies',
                        description: 'They allow us to recognize and count the number of visitors and to see how visitors move around our website when they are using it. This helps us to improve the way our website works, for example, by ensuring that users are finding what they are looking for easily.',
                        toggle: {
                            value: 'analytics',     // your cookie category
                            enabled: false,
                            readonly: false
                        },
                        cookie_table: [             // list of all expected cookies
                            {
                                col1: 'wooTracker',
                                col2: 'woopra.com',
                                col3: '5 days',
                                col4: 'ID used to identify users for 5 days after last activity',
                            }
                        ]
                    },
                    // {
                    //     title: 'Advertisement and Targeting cookies',
                    //     description: 'These cookies collect information about how you use the website, which pages you visited and which links you clicked on. All of the data is anonymized and cannot be used to identify you',
                    //     toggle: {
                    //         value: 'targeting',
                    //         enabled: false,
                    //         readonly: false
                    //     }
                    // },
                    {
                        title: 'More information',
                        description: 'For any queries in relation to our policy on cookies and your choices, please <a class="cc-link" href="mailto:contact@cansixt.cat">contact us</a>.',
                    }
                ]
            }
        }
    }
});
