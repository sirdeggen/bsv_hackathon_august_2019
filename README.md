# Ask The World

https://asktheworld.net/

Ask the world is a service for asking questions and getting answers.

It provides a way for new users to Earn Bitcoin, while also doing the right thing - sharing information.

# Incentives

The right incentives change everything.

- AskTheWorld has very low entry barriers, and we can make them even lower
  - No wallet needed on registration.
  - Address is only needed if you are replying
  - Rewarding answers to your questions requires MoneyButton right now. This is the biggest barrier we have.

- AskTheWorld motivates people to share valuable information
  - instead of putting barriers in front of information, we motivate people with a potential reward, but ONLY if the question author approves the answer.
  - "Information wants to be valued." - Someone Very Smart

- To deal with possible question authors who never pay what they promised, we use reputation as an incentive
  - But reputation is hard to measure. It is complex. It is subjective.
  - Instead, we simply present the history of the user and let others draw their own conclusions.
  - Unpaid questions, underpaid ones, overpaid ones... all will be visible from the profile.

# Goals

- Entry gate for new users
- Useful site even for non-users
- Incentivize people to do good.

# How to run

- make sure you have node and npm

- in order to experience the full application, a ```.env``` file is needed. See the ```.env.example``` template provided in the code.
  - without a ```.env``` file, you won't be able to log into the system
  - (since this is a hackaton competition entry, an ```.env``` file will be provided to the judges.)

- install mongodb, as explained in: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/

- run the mongodb database

```bash
sudo service mongod start
```

- update npm:

```bash
sudo npm i -g npm
```

```bash
git clone https://github.com/sirdeggen/bsv_hackathon_august_2019.git asktheworld
cd asktheworld

npm i
npm run dev

```
- this runs the server in development mode. To run in production, execute 

```bash
npm i; node index.js
```

- the google OAuth login only works on the main website asktheworld.net

# Known Problems

- Only question creators should be able to mark answers, or pay rewards.
  - Other user should be able to tip, but not give the main reward.
  - (Tips don't need to be counted or displayed.)

- usernames are not displayed on replies

- the profile doesn't yet make it obvious how the person was acting.

- locking of the reward funds doesn't work yet

- amounts are displayed in satoshis instead of BSV

- other (mostly visual) issues

- no edit or delete functionality

- no admin functionality
