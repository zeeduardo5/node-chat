const expect = require('expect');

const { Users } = require('./users');

describe('Users', () => {
    var users;
    beforeEach(() => {
        users = new Users();
        console.log('here')
        users.users = [{
            id: '1',
            name: 'Mike',
            room: 'Node Course'
        }, {
            id: '2',
            name: 'Jen',
            room: 'React Course'
        }, {
            id: '3',
            name: 'Julie',
            room: 'Node Course'
        }];
    });
    it('should add new user', () => {
        var users = new Users();

        var user = {
            id: '1',
            name: 'Mike',
            room: 'Node Course'
        };
        var resUser = users.addUser(user.id, user.name, user.room);
        expect(users.users).toEqual([user]);
    })

    it('should remove an user', () => {
      
        var removedUser = users.removeUser('1');
        expect(removedUser).toEqual({
            id: '1',
            name: 'Mike',
            room: 'Node Course'
        });
    })

    it('should find an user', () => {
        var userId = '1'
        var user = users.getUser(userId);
        expect(user.id).toEqual(userId);
    })

    it('should not find an user', () => {
        var userId = '4'
        var user = users.getUser(userId);
        expect(user).toNotExist();
    })

    it('should return name for node course', () => {
      
        var userList = users.getUserList('Node Course');
        expect(userList).toEqual(['Mike', 'Julie']);
    })
})