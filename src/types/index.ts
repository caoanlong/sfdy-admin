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
    vodPlot: number,
    status?: number,
    permission?: number,
    loading?: boolean
}

export type TypeExtend = {
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
    typeName?: string,
    typeEn?: string,
    typeSort?: number,
    typeMid?: number,
    typePid?: number,
    typeStatus?: number,
    typeKey?: string,
    typeDes?: string,
    typeExtend?: string,
    typeExtendJson?: TypeExtend,
    classList?: string[]
}

export type Banner = {
    bannerId?: number,
    bannerType: number,
    bannerName: string,
    bannerSort: number,
    bannerTime?: Date,
    bannerFile?: File,
    bannerUrl?: string,
    bannerLink?: string
}

export type Link = {
    linkId?: number,
    linkType?: number,
    linkName: string,
    linkSort: number,
    linkAddTime?: number,
    linkTime?: number,
    linkUrl: string,
    linkLogo?: string,
    linkFile?: File
}

export type Seo = {
    seoId?: number,
    seoTitle?: string,
    seoKeywords?: string,
    seoDescription?: string,
    seoTime?: Date,
    seoScript?: string,
}

export type Vip = {
    vipId?: number,
    id?: number,  // MemberVipID
    validDays: number,
    price: number,
    createTime?: Date,
    updateTime?: Date,
    startTime?: Date
}

export type Member = {
    memberId?: number,
    platform?: number,
    memberName?: string,
    mobile?: string,
    email?: string,
    avatar?: string,
    password?: string,
    isAgent?: number, // 0: 普通玩家， 1：代理
    regType?: number, // 1: mobile, 2: email
    referrerId?: number, // 推荐人ID
    status: number, // 0: 禁用， 1： 正常
    randomCode?: string, // 推广链接随机码
    totalRecharge?: number,  // 充值总额，默认为0未充值
    balance?: number,
    loginIp?: number,
    loginNum?: number,
    lastLoginIp?: number,
    loginTime?: Date,
    lastLoginTime?: Date,
    createTime?: Date,
    updateTime?: Date,
    avatarFile?: File,
    vipIds?: number[],
    vips?: Vip[]
}

export type Order = {
    orderId: number,
    platform: number,   // 1: jyav 2: fenglou
    memberId: number,
    title: string,
    vipId: number,
    orderNo: string,
    amount: number, // 金额
    type: number, // 1: 充值， 2：提现， 3：佣金
    category: number, // 1: VIP 2: 其他产品...
    status: number, // 1: 确认中 2: 成功  3: 失败
    description: number,
    extraInfo: number,
    createTime: Date,
    updateTime: Date,
    payIp: string,
    memberName: string,
    memberEmail: string,
    memberMobile: string
}

export type AppVersion = {
    id?: number,
    appId?: string,
    platform?: number,
    appName?: string,
    newVersion: string,
    newVersionCode: number,
    minVersion: string,
    minVersionCode: number,
    appUrl: string,
    description: string,
    isUpdate: number,
    device: number, // 1: 安卓 2: iOS
    size: number,
    createTime?: Date
}

export type TagItem = {
    id?: number,
    name?: string
}

export type City = {
    id?: number,
    pId?: number,
    name?: string,
    ename?: string,
    sort?: number,
    pName?: string
}

export type Province = {
    id?: number,
    name?: string,
    ename?: string,
    sort?: number
}

export type Post = {
    id?: number,
    title?: string,
    content?: string,
    price?: number,
    contactInfo?: string,
    image?: string,
    city?: number,
    province?: number,
    cityName?: string,
    provinceName?: string,
    imageFile?: File,
    createTime?: Date,
    updateTime?: Date,
    tags?: number[],
    tagList?: TagItem[]
}