# libsim

is a web-based novel collection platform. Use libsim to save entries between friends and exchange your favorite novels through the built-in chat! Create custom collections and organize your works, as well as your friends' works. You can view the app demo on [YouTube](https://youtu.be/D3USrep3YQM).

![public/demo.jpg](https://github.com/vempr/libsim/blob/6f4a484e49ba3a72b81c830c442c567328b92e77/public/demo.jpg)

This application was built with Laravel, Inertia and React from Laravel's React Starter Kit. I used [Laravel Reverb](https://reverb.laravel.com/) for real-time chat/notifications and [Render](https://www.render.com) to deploy libsim.

## Features

* **User authentication & authorization**: Secure login, registration, password reset, email verification, and authorization policies across all controllers.
* **User profiles**: Manage and display user profiles, including avatars and personalized information.
* **Work management**: Create, and edit the page for a work you're reading.
* **Collections**: Organize your own and others' works into custom collections.
* **Favorites**: Mark favorite works for quick access.
* **Real-time chat**: Message your friends and send works with one click!
* **Friend system**: Send, accept, and manage friend requests.
* **Notifications**: Receive real-time notifications for various activities (messages, friend requests, etc.).
* **Search functionality**: Efficiently search for works and users.
* **Responsive design**: A user interface that adapts across various devices.

## Credits
- Flags: https://github.com/catamphetamine/country-flag-icons
- User interface inspiration: https://mangadex.org
- Tailwind theme: https://tweakcn.com/

## AI (Deepseek, Claude)...
- helped with advanced controller instructions (see `FriendController.php`, `WorkController.php`)
- helped with large styling blocks and flex div slop
- generated readme `## Features` by providing libsim's tree structure
- helped with deployment, especially `Dockerfile`
- generated long json data (see `dashboard.tsx`)
- overwrite mails' css styling to fit `app.css`
