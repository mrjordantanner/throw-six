# 'Throw Six' :game_die:
### a Dice Game by Jordan T Smith

In 'Throw Six', six dice are thrown and the player and computer alternate turns. Points are gained for every 1 or 5 thrown, for three or more of a kind, and for straights. The first player to earn 5000 points is the winner.

![Throw-Six-GIF-2](https://user-images.githubusercontent.com/50030252/109187859-e8693080-7757-11eb-8038-0992fa681646.gif)


### Play Here: https://mrjordantanner.github.io/throw-six/

# How to Play :game_die:
A player's turn always begins by throwing all six dice. The player then must set aside scoring dice, and at least one scoring die must always be set aside. Then the player can throw the remaining dice again and the situation repeats. Scoring combinations are counted only for the current throw.

Click the 'Throw 6' button to throw six dice.  If you rolled any scoring dice, they'll have colored borders around them.  Click at least one scoring die to move it to your scoring area, then choose to either 'Stand' and collect your earnings for the round or take your chances and roll the remaining dice to attempt to earn more points.  Repeat until all dice have been scored or the player 'Busts' by not rolling any scoring dice, thus losing all their points for that round.

<img width="1434" alt="Screen Shot 2021-02-25 at 9 11 25 AM" src="https://user-images.githubusercontent.com/50030252/109173502-843f7000-7749-11eb-8d3a-2991d4742e5d.png">

##### 'Busting' means rolling no scoring dice and losing any points earned that round.

---
## Scoring 🧮
- Single 1 = 100 points
- Single 5 = 50 points
- Three of a kind = 100 points multiplied by the face value of the dice
- Four or more of a kind = double the points of three of a kind, and so on
- Three 1's = 1,000 points
- Full Straight 1-6 = 1500 points
- Partial Straight 1-5 = 500 points
- Partial Straight 2-6 = 750 points
___
![Screen Shot 2021-02-25 at 8 31 51 AM](https://user-images.githubusercontent.com/50030252/109171255-37f33080-7747-11eb-9d23-c5cdc7b00db0.png)

# Under the Hood :gear:
After creating and rolling the dice objects, the game checks for any straights, three or more of a kind, or single 1's or 5's.  If it finds any, it assigns each group of dice to a 'Scoring Group' and gives it the appropriate point value.  Single scoring dice are given their own group and are treated the same way as a group.

As the player clicks dice groups to move them to the scoring area, their point values are added to the running total for the round until they decide to 'Stand' and collect, or keep rolling and bust. 

___
# Screenshots & Wireframes

![dice-sketch-1](https://user-images.githubusercontent.com/50030252/109171458-6b35bf80-7747-11eb-98fd-f574a0528e62.jpeg)

![Screen Shot 2021-02-20 at 6 28 06 PM](https://user-images.githubusercontent.com/50030252/109174238-468f1700-774a-11eb-8add-f710601508a7.png)

<img width="1425" alt="Screen Shot 2021-02-22 at 2 13 36 PM" src="https://user-images.githubusercontent.com/50030252/109174353-63c3e580-774a-11eb-9fe4-15c82e9d6826.png">

<img width="1435" alt="Screen Shot 2021-02-23 at 1 51 51 PM" src="https://user-images.githubusercontent.com/50030252/109174380-6a525d00-774a-11eb-8937-1c6760f19548.png">

![Screen Shot 2021-02-23 at 4 21 04 PM](https://user-images.githubusercontent.com/50030252/109174526-88b85880-774a-11eb-86fc-a486a095796b.png)

![Screen Shot 2021-02-25 at 8 30 20 AM](https://user-images.githubusercontent.com/50030252/109174638-a08fdc80-774a-11eb-93d3-95c04b08deaa.png)

---
## Technologies Used :jigsaw:
HTML | CSS | JavasScript

## Hurdles
This game was built entirely from scratch for the General Assembly Software Engineering Immersive Unit 1 Project.
One of the main challenges in designing the logic for this game was properly identifying the scoring dice in all situations and to be able to treat the dice as groups, not individual dice.  The randomized motion of the dice presented a challenge as well.

## User Stories :raising_hand_woman:
- As someone who enjoys tabletop games, I want to play a digital version of a  dice game that automatically keeps track of dice point values for me.
- As a gambler, I want to enjoy the risk vs. reward that comes along with games of chance.

## Planned Features :arrow_forward:
If this project is expanded upon further, I plan to add:
- Title screen and menu
- Full sound effects and music
- Custom color schemes and dice colors
- All dice in scoring group are highlighted when one member of the group is hovered over
- A more detailed tooltip appears on mouseover over certain key items to provide more information to the user.

## Known Issues :microbe:
- Sometimes clicking on dice doesn't register

## Credits :white_check_mark:
- This application was written entirely by me, Jordan Smith, unless otherwise cited in the code.

- The game concept and rules come from a mini-game in the video game "Kingdom Come."

## Installation Instructions
- Simply fork and clone this repository.