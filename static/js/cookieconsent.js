const im = iframemanager();

im.run({
    onChange: ({ changedServices, eventSource }) => {
        if (eventSource.type === 'click') {
        const servicesToAccept = [
            ...CookieConsent.getUserPreferences().acceptedServices['analytics'],
            ...changedServices,
        ];
    
        CookieConsent.acceptService(servicesToAccept, 'analytics');
        }
    },
    
    currLang: 'en',
    
    services: {
        youtube: {
        embedUrl: 'https://www.youtube-nocookie.com/embed/{data-id}',
        thumbnailUrl: 'https://i3.ytimg.com/vi/{data-id}/hqdefault.jpg',
    
        iframe: {
            allow:
            'accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen;',
        },
    
        languages: {
            en: {
            notice:
                'This content is hosted by a third party. By showing the external content you accept the <a rel="noreferrer noopener" href="https://www.youtube.com/t/terms" target="_blank">terms and conditions</a> of youtube.com.',
            loadAllBtn: 'Accept and Load',
            },
        },
        },
    
        vimeo: {
        embedUrl: 'https://player.vimeo.com/video/{data-id}',
        iframe: {
            allow: 'fullscreen; picture-in-picture;',
        },
    
        thumbnailUrl: async (dataId, setThumbnail) => {
            const url = `https://vimeo.com/api/v2/video/${dataId}.json`;
            const response = await (await fetch(url)).json();
            const thumbnailUrl = response[0]?.thumbnail_large;
            thumbnailUrl && setThumbnail(thumbnailUrl);
        },
    
        languages: {
            en: {
            notice:
                'This content is hosted by a third party. By showing the external content you accept the <a rel="noreferrer noopener" href="https://vimeo.com/terms" target="_blank">terms and conditions</a> of vimeo.com.',
            loadBtn: 'Load once',
            loadAllBtn: "Don't ask again",
            },
        },
        },
    },
});

/**
 * All config. options available here:
 * https://cookieconsent.orestbida.com/reference/configuration-reference.html
 */
CookieConsent.run({

    root: 'body',
    autoShow: true,
    disablePageInteraction: true,
    hideFromBots: true,
    mode: 'opt-in',
    revision: 2,

    cookie: {
        name: 'cc_cookie',
        // domain: blog.cansixt.cat,
        // path: '/',
        // sameSite: "Lax",
        // expiresAfterDays: 365,
    },

    // https://cookieconsent.orestbida.com/reference/configuration-reference.html#guioptions
    guiOptions: {
        consentModal: {
            layout: 'box wide',
            position: 'middle center',
            equalWeightButtons: false,
            flipButtons: true
        },
        preferencesModal: {
            layout: 'box',
            equalWeightButtons: false,
            flipButtons: true
        }
    },

    onFirstConsent: ({cookie}) => {
        console.log('onFirstConsent fired',cookie);
    },

    onConsent: ({cookie}) => {
        console.log('onConsent fired!', cookie)
    },

    onChange: ({changedCategories, changedServices}) => {
        console.log('onChange fired!', changedCategories, changedServices);
    },

    onModalReady: ({modalName}) => {
        console.log('ready:', modalName);
    },

    onModalShow: ({modalName}) => {
        console.log('visible:', modalName);
    },

    onModalHide: ({modalName}) => {
        console.log('hidden:', modalName);
    },

    categories: {
        necessary: {
            enabled: true,  // this category is enabled by default
            readOnly: true  // this category cannot be disabled
        },
        analytics: {
            autoClear: {
                cookies: [
                    {
                        name: /^_ga/,   // regex: match all cookies starting with '_ga'
                    },
                    {
                        name: '_gid',   // string: exact cookie name
                    }
                ]
            },

            // https://cookieconsent.orestbida.com/reference/configuration-reference.html#category-services
            services: {
                ga: {
                    label: 'Google Analytics',
                    onAccept: () => {},
                    onReject: () => {}
                },
                youtube: {
                    label: 'Youtube Embed',
                    onAccept: () => im.acceptService('youtube'),
                    onReject: () => im.rejectService('youtube'),
                },
                vimeo: {
                    label: 'Vimeo Embed',
                    onAccept: () => im.acceptService('vimeo'),
                    onReject: () => im.rejectService('vimeo'),
                },
            }
        },
        ads: {}
    },

    language: {
        default: 'en',
        translations: {
            en: {
                consentModal: {
                    title: 'We like cookies!',
                    description: 'Hi, this website uses cookies to understand how you interact with it. This will be set only after consent. All of the data is anonymized and cannot be used to identify you.',
                    acceptAllBtn: 'Accept all',
                    acceptNecessaryBtn: 'Reject all',
                    showPreferencesBtn: 'Manage Individual preferences',
                    // closeIconLabel: 'Reject all and close modal',
                    footer: `
                        <a href="/privacy-policy" target="_blank">Privacy Policy</a>
                    `,
                },
                preferencesModal: {
                    title: 'Manage cookie preferences',
                    acceptAllBtn: 'Accept all',
                    acceptNecessaryBtn: 'Reject all',
                    savePreferencesBtn: 'Accept current selection',
                    closeIconLabel: 'Close modal',
                    serviceCounterLabel: 'Service|Services',
                    sections: [
                        {
                            title: 'Your Privacy Choices',
                            description: `In this panel you can express some preferences related to the processing of your personal information. You may review and change expressed choices at any time by resurfacing this panel via the provided link in the page's footer. To deny your consent to the specific processing activities described below, switch the toggles to off or use the “Reject all” button and confirm you want to save your choices.`,
                        },
                        {
                            title: 'Strictly Necessary',
                            description: 'These cookies are essential for the proper functioning of the website and cannot be disabled.  Without this cookie, this website can not properly offer compliant consent management.',

                            //this field will generate a toggle linked to the 'necessary' category
                            linkedCategory: 'necessary'
                        },
                        {
                            title: 'Performance and Analytics',
                            description: 'These cookies collect information about how you use our website. All of the data is anonymized and cannot be used to identify you.',
                            linkedCategory: 'analytics',
                            cookieTable: {
                                caption: 'Cookie table',
                                headers: {
                                    name: 'Cookie',
                                    domain: 'Domain',
                                    desc: 'Description'
                                },
                                body: [
                                    {
                                        name: '_ga',
                                        domain: location.hostname,
                                        desc: 'Statistics oriented cookie attribute. It is a random unique identifier used to identify a user browser session. It expires every 2 years.',
                                    },
                                    {
                                        name: '_gid',
                                        domain: location.hostname,
                                        desc: 'Statistics oriented cookie attribute. It is an identifier used to store and count pageviews. It expires every 24 hours.',
                                    }
                                ]
                            }
                        },
                        // {
                        //     title: 'Targeting and Advertising',
                        //     description: 'These cookies are used to make advertising messages more relevant to you and your interests. The intention is to display ads that are relevant and engaging for the individual user and thereby more valuable for publishers and third party advertisers.',
                        //     linkedCategory: 'ads',
                        // },
                        {
                            title: 'More information',
                            description: 'For any queries in relation to our policy on cookies and your choices, please <a class="cc-link" href="mailto:contact@cansixt.cat">contact us</a>.'
                        }
                    ]
                }
            }
        }
    }
});
