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