/* eslint-disable */


export function ip2long(ip: string){
    let ipl = 0
    ip.split('.').forEach((octet) => {
        ipl<<=8
        ipl+=parseInt(octet)
    })
    return(ipl >>>0)
}


export function long2ip(ipl: number){
    return ( (ipl>>>24) +'.' +
        (ipl>>16 & 255) +'.' +
        (ipl>>8 & 255) +'.' +
        (ipl & 255) )
}

export function decodeUnicode(str: string) {
    str = str.replace(/\\/g, "%")
    return unescape(str)
}

export function formDataReq(json: any) {
    const formData = new FormData()
    for (let attr in json) {
        if (json[attr] || json[attr] === 0) formData.append(attr, json[attr])
    }
    return formData
}
