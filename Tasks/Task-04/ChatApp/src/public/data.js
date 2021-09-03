let IDStart = 1;

export class User {
    constructor(name) {
        this.name = name;
        this.id = IDStart;
        IDStart = IDStart + 1;
    }
}

export class Message {
    constructor(message, sender_id) {
        this.sender_id = sender_id;
        this.message = message;
    }
}

export class Group {
    constructor(name) {
        this.name = name;
        this.messages = [];
    }
}

const Groups = [];
const Users = [];

let CurrentUser = null;
let CurrentGroup = null;

export function GetGroup(group_name) {
    return Groups.filter(g => { return g.name === group_name }).at(0);
}

export function GetUser(user_name) {
    return Users.filter(u => { return u.name === user_name }).at(0);
}

export function CheckGroupExists(group_name) {
    return Groups.filter(g => g.name === group_name).length > 0;
}

export function CheckUserExists(user_name) {
    return Users.filter(u => u.name === user_name).length > 0;
}

function IsEmpty(str) {
    return (!str || str.length === 0);
}

function IsBlank(str) {
    return (!str || /^\s*$/.test(str));
}

export function InputIsValid(input) {
    return (!IsEmpty(input) && !IsBlank(input));
}

export function SetCurrentUser(user) {
    CurrentUser = user;
}

export function SetCurrentGroup(group) {
    CurrentGroup = group;
}

export { Groups, Users, CurrentUser, CurrentGroup };