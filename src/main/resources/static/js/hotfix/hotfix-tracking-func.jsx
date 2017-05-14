import $ from "jquery"

function promiseGetHotfixInfo( hfid, version ) {
    return $.ajax( {
        url: `/apis-hotfix/hotfix/${version}/${hfid}`,
        method: "GET",
        dataType: "json",
    })
}

function promiseGetTrackingDocData( version, documentID ) {
    return $.ajax( {
        url: `/apis-hotfix/tracking-document/${version}/${documentID}`,
        method: "GET",
        dataType: "json",
    })
}

function analyzeDependencies( hfidList ) {
    return $.ajax( {
        url: "/apis-hotfix/hotfix-dependency/763",
        data: { hfid: hfidList },
        method: "GET",
        dataType: "json"
    })
}

function searchHotfix( version, searchParams ) {
    return $.ajax( {
        url: `/apis-hotfix/search-hotfix/${version}`,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        dataType: "json",
        data: JSON.stringify( searchParams )
    })
}

function saveTrackingDoc( trackingDoc ) {
    return $.ajax( {
        url: `/apis-hotfix/tracking-document/save`,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        dataType: "html",
        data: JSON.stringify( trackingDoc )
    })
}

function getMailClient( mailInfo ) {
    return $.ajax( {
        url: "/mail",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        dataType: "html",
        data: JSON.stringify( mailInfo )
    })
}

function getHotfixInfoURL( HFID, version ) {
    let url = `/hotfix/${version}/${HFID}`
    return $.when( url )
}

function putResource( resource ) {
    let data = new FormData()
    data.append("file", resource.file)
    return $.ajax( {
        url: `/apis-mail/resource/${resource.id}`,
        contentType: false,
        method: "PUT",
        dataType: "html",
        processData: false,
        data: data
    })
}

function sendMail(mailInfo) {
    return $.ajax( {
        url: `/apis-mail/send`,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: "POST",
        dataType: "html",
        data: JSON.stringify( mailInfo )
    })
}

export default {
    promiseGetHotfixInfo,
    promiseGetTrackingDocData,
    analyzeDependencies,
    searchHotfix,
    saveTrackingDoc,
    getMailClient,
    getHotfixInfoURL,
    putResource,
    sendMail
}