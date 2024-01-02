# Definition

Version | Last Updated | Created | Author
---------|----------|---------
 0.1 | 2020-12-08 | 2020-12-08 | sang.ngo@dirox.net

## Entity

Name | Description
---------|----------

### BaseEntity

Field | Type | DB Field | Mandatory | Description
---------|----------|---------|---------|---------
 **createdAt** | bigint | created_at | false | unix timestamp in milliseconds
 **updatedAt** | bigint | updated_at | false | unix timestamp in milliseconds

### BaseUser extends BaseEntity

Field | Type | DB Field | Mandatory | Description
---------|----------|---------|---------|---------
 **id** | uuid_v4() | id | true | primary key - auto generate key
 **email** | varchar(60) | first_name | true | user's firstname
 **password** | varchar(60) | password | true | bcrypt hashed
 **status** | enum | status | true | admin user status

> https://en.wikipedia.org/wiki/Tz_database.

> - The Area and Location names have a maximum length of 14 characters.
> - Eg : Asia/Bankok - {Area}/{Location}
> - Maximum Length = 14 + 14 + 1 = 29
> - Secured Length for this field can be 30 -> so we choose **36** ( 3+6 = 9 : nice number)