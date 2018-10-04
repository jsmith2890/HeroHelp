

# HeroHelp!
<p align="center">
  <img src="https://user-images.githubusercontent.com/37457477/46446459-13dfc080-c742-11e8-92de-4aeed2194884.png">
</p>

HeroHelp is the modern-day Bat Signal. More specifically, it's a two-sided real-time coordinated mobile app system for incident management. Citizens can call for help and Heroes can respond to dispatches and resolve incidents.

This project was created by four students at Fullstack Academy in Chicago. We had two weeks to put together a Capstone project -- a prototype application incorporating web technologies learned during the prior 10 weeks of the program as well as new technologies we were interested in exploring. We chose to explore integrating websockets with Google Maps and React Native to create a real-time incident management system.

An explanation of the top-level projects:
* **admin** : contains the admin interface
* **client** : contains the Citizen & Hero React Native apps
* **server** : contains the backend-server
* **simulator**	: contains the simulator. Essentially a node client that simulates the Citizen and Hero clients for helping to test the React Native apps independently

admin This project is a web app that displays information about the running system that would be useful to an operator (Ex: incidents in progress, heatmap of incidents, which hero is assigned to what incident, etc). It's dependent on the server project b/c it uses the server's database code to access the same database.
End with an example of getting some data out of the system or using it for a little demo

## Built With

* [React Native](https://github.com/react-community/create-react-native-app) - mobile application front end framework
* [Native Base](https://nativebase.io/) - React Native UI framework
* [Redux](https://redux.js.org/) - front end state management
* [Socket.io](https://socket.io/docs/) - send messages between citizen, hero, and server
* [Google Maps API](https://developers.google.com/maps/documentation/) - front end map interface
* [Expo](https://docs.expo.io/versions/latest/) - complimentary library to React Native
* [Sequelize](http://docs.sequelizejs.com/) - database queries
* [PostgreSQL](https://www.postgresql.org/docs/) - object-relational database management system


## Authors

* **Brandon Yee** - *Developer* - (https://github.com/brandonjyee)
* **Brad Smith** - *Developer* - (https://github.com/bradsmith712)
* **Jeff Hauser** - *Developer* - (https://github.com/jeffhauserchi)
* **Jessica Smith** - *Developer* - (https://github.com/jsmith2890)
* **Jasmine Munoz** - *Advisor* - (https://github.com/jmunoz1992)
* **Fullstack Academy** - *Boilerplate* - (https://github.com/FullstackAcademy)

## Link to Demo Video
https://www.youtube.com/watch?v=N5SJ75VoWKA&amp=&t=0s&amp=&index=13

