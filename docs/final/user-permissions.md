# Managing User Permissions

## At a glance

  - Neatline has a simple user permissions system system designed to make it easy to use Neatline with large groups.
  - "Researcher" users can view public exhibits, but don't have access to any of the administrative features.
  - "Contributor" users can create and modify their own exhibits, but can't make changes to other users' exhibits.
  - "Admin" and "Super" users can do everything - they can create, modify, and delete exhibits created by all users.
  - When groups of users need to work together as a team, just assign a "Contributor" account to the whole group.

## User permissions overview

If you're working with a handful of trusted collaborators, user permissions (eg, preventing User A from modifying ot deleting an exhibit created by User B) aren't a big deal - it's generally fine for everyone to have access to everyone else's work. Things get a bit trickier, though, if you're using Neatline with large numbers of people - for eample, if you're teaching a 200-person lecture course, and want to use Neatline for an assignment. Even if none of the users are malicious, with that many people clicking around in the system it's just a matter of time before someone accidentally deletes someone else's work, etc. There needs to be a way to rope off users and ensure that they can only make changes to their own content.

To accomplish this, Neatline makes use of the built-in ACL (Access Control List) system in Omeka, which defines a series of user "roles" for site administrators, each with a different level of access (see the [Omeka documentation][omeka-acl] for more information about how to create and manage user roles). Here's how Neatline grants privileges to the different roles:

  - **Researcher** users are completely locked out of Neatline - they can't create, edit, or delete exhibits. Effectively, researchers have the same level of access as an anonymous, public user - they can view published exhibits, but nothing else. This conforms with Omeka's definition of the Researcher role, which was originally added so that site administrators could make it possible for certain users to _view_ non-public items, without being able to modify content on the site.

  - **Contributor** users can create, edit, and delete _their own exhibits_, but can't make changes to anyone else's exhibits. This is the role that's best suited for students, workshop participants, and other users who need to be able to work with their own Neatline content, but who don't need to make high-level changes to the site (eg, changing themes, installing plugins).

  - **Admin** and **Super** users can do everything - they can create, modify, and delete exhibits created by all users.

## Working with user "groups"

User roles can only be assigned to individual users - Omeka has no notion of a "group" of users. This is problematic if you want to make it possible for teams of users to work collaboratively on the same exhibit. It doesn't work to just create separate "Contributor" accounts for each of the users, which would make it possible for each individual user to create her _own_ exhibits, but not for the entire group to make edits to the same exhibit. You could always just make all of the users "Admin" users, but that defeats the point of the permissions system altogether - everyone would be able to edit _everyone_ else's content, not just the exhibits that are "owned" by the group.

For now, the easiest way to deal with this is just to create a single "Contributor" account for each group. So, if you have 10 groups, each comprised of 4 students, create 10 "Contributor" accounts and give the same set of login credentials to all 4 students in each of the 10 groups.


[omeka-acl]: http://omeka.org/codex/Managing_Users_2.0
