const GroupNames = ["group 1", "group 2", "group 3"];
const UserNames = ["user 1", "user 2", "user 3"];
const GroupMessages = [];
let IDStart = 1;

export function CheckGroupExists(group_name) {
    return GroupNames.includes(group_name)
}

export function CheckUserExists(group_name) {
    return UserNames.includes(group_name)
}

export { GroupNames, UserNames, GroupMessages, IDStart };