NOTE: the following is a work (very much) in progress 

## Overview

**Ranked choice voting is a simple idea.** There are complexities and nuances to discuss beneath the surface, of course, 
but *at* the surface the basic idea is very easy to understand, and even a very basic understanding makes much of why it 
can work so well as a collective decision-making mechanism intuitively apparent. The purpose of this project is to 
communicate that simple idea, hopefully in a way that leaves the user with that intuition. 

Our application allows users to experience ranked choice voting in a hands-on way from several angles. Given our emphasis
on communicating the simplicity and elegance of the idea of RCV, it is imperative that **simplicity and elegance is embodied 
in the look, feel and behavior of the application**, and this need will be reflected in our design and execution of each 
of its interfaces. At the same time, we want to satisfy a range of use cases that will demand a significant degree of 
explorability, discoverability, and customizability in different parts of the application: This theme of simplicity at 
the surface underlain by a depth of capability beneath will recur in many of our interfaces: 

## Interfaces

**[Poll create](src/app/create/README.md)**: We’ll set out with the goal that **a new user can create a poll in ten seconds 
plus ten seconds per poll option.** This is achievable if and only if we ask the user for no more than the question they’re 
asking and the name or a brief definition of each candidate answer. The application must be able to derive anything more 
it needs to display the poll either algorithmically or from sensible defaults. At the same time, while we don’t want to 
*require* poll creators to make any further decisions, we want to *allow* them to customize their polls in several ways. 

**[Poll Results](src/app/results/README.md)**: The need to strike a balance between simplicity and depth is perhaps most 
apparent in the results interface: **The app is first and foremost an educational tool**, with a fundamental goal of 
leaving the user with a deeper understanding of RCV than they had at the start. The better part of understanding RCV 
lies in understanding how the results are decided, and depicting that in the simplest, clearest and most visually engaging 
way possible will lead to our best outcome with many users. Others, however, will want to explore, play with and ultimately 
understand the results on a deeper level, and our interface should offer them as many opportunities to do that as possible. 

                                                                                                                                                                                                               
This is an area where the app can certainly grow and deepen [through community contributions](/CONTRIBUTING.md) after its 
initial launch, but at the outset we want an interface that allows users to remove candidates and explore how hypothetical 
polls would proceed without them. In general, our goal here should be to not only provide opportunities for deeper 
exploration and understanding but to make those opportunities compelling, fun and interesting enough to draw users to engage in them. 
                                
                                                                                              
**[Ballot](src/app/ballot/README.md)**: The voting interface should be designed to encourage the user to **fully engage in 
the mental process of crafting their ranked choice expression**, hopefully in a way that highlights the relative depth and 
breadth of what they can say through it versus what they can say through traditional first-past-the-post elections. One 
subservient goal to that end will be encouraging users to rank all available options, and the degree to which that happens 
will be a useful metric of our success on this front. 

                                 
After voting, the user will then be asked if they’d like to share their ballot via social media. They will also be able 
to share a link to the poll itself without disclosing their vote, but we anticipate many users will be more inclined to 
share an expression they've crafted themselves, which in turn will increase the virality of the app                                                                                             
                                                            

**[Site Home](src/app/home/README.md)**: New users to rcvapp.com should be greeted with an interface that:
- Introduces them to the application, what it does and how to use it
- Provides a basic introduction to RCV with links to further resources
- Allows them to browse ongoing polls, sorting them by recency or popularity and perhaps filtering by topic. 

**[User Home](src/app/)**: Existing users should have a single place they can go to see and edit all polls they’ve created. 
They should also have a (separate) single place where they can view all votes they’ve cast and see how the polls they 
cast them in have progressed. 
                           
                           
## API 

For researchers and others interested in analyzing poll data in raw format, an API will be provided at api.rcvapp.com, 
exposing the following data types in either JSON or CSV format:

##### User 

field | type | description 
----- | ---- | -----------
uid | string | unique identifier
name | string | the display name of the user 
image | string | URI of image associated with the option

##### Vote 
field | type | description 
----- | ---- | -----------
uid | string | unique identifier
choices | string[] | an ordered array of the options the user chose, identified by their UID's
voterId | string | uid of the user who cast this vote, if they chose to make it public. If not, this field is null.   
pollId | string | uid of the poll the vote was cast in
created | timestamp | when the vote was cast 
isPublic | boolean | whether the user has chosen to make this vote public (default: alse)

##### PollOption
field | type | description 
----- | ---- | -----------
uid | string | unique identifier
text | string | the name or brief description of the option
image | string | URI of image associated with the option

##### Poll 
field | type | description
----- | ---- | -----------
uid | string | unique identifier
prompt | string | the question being asked in the poll
options | PollOption[] | the available answers being chosen between 
security | string | the security setting for this poll ([link](src/app/create/README.md#security))
expires | timestamp | when the poll should be automatically closed (or null) 
created | timestamp | when the poll was created
votes | Vote[] | the votes that have been cast in the poll 
voters | User[] | the users who have cast votes in this poll


### Endpoints 

The above data types will be exposed via the following REST schema: 
 
//TODO
