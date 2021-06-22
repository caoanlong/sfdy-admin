export type Res<T> = {
    code: number,
    message: string,
    data?: T
}

export type User = {
    adminId?: number,
    adminName?: string,
    adminStatus?: number,
    adminAuth?: string,
    adminLoginTime?: number,
    adminLoginIp?: number,
    adminLoginNum?: number,
    adminLastLoginTime?: number,
    adminLastLoginIp?: number
}

export type Vod = {
    vodId: number,
    typeId: number,
    typeId1: number,
    groupId: number,
    vodName: string,
    vodEn: string,
    vodStatus: number,
    vodLetter: string,
    vodClass: string,
    vodPic: string,
    vodTotal: number,
    vodSerial: number,
    vodIsend: number,
    vodLock: number,
    vodLevel: number,
    vodCopyright: number,
    vodPoints: number,
    vodPointsPlay: number,
    vodPointsDown: number,
    vodHits: number,
    vodHitsDay: number,
    vodHitsWeek: number,
    vodHitsMonth: number,
    vodUp: number,
    vodDown: number,
    vodScore: number,
    vodScoreAll: number,
    vodScoreNum: number,
    vodTime: number,
    vodTimeAdd: number,
    vodTimeHits: number,
    vodTimeMake: number,
    vodTrysee: number,
    vodDoubanId: number,
    vodDoubanScore: number,
    vodPlayFrom: string,
    vodPlayServer: string,
    vodPlayUrl: string,
    vodPlot: number
}

type TypeExtend = {
    class: string,
    area: string,
    lang: string,
    year: string,
    star: string,
    director: string,
    state: string,
    version: string
}

export type VodType = {
    typeId: number,
    typeName: string,
    typeEn: string,
    typeSort: number,
    typeMid: number,
    typePid: number,
    typeStatus: number,
    typeKey: string,
    typeDes: string,
    typeExtend: string,
    typeExtendJson?: TypeExtend,
    classList: string[]
}