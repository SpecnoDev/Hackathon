# Hackathon discussion #2

Fri, 18 Sept 26

#### Problem Statement

- Financial and technological exclusion of local entrepreneurs from South Africa’s tourism economy
- Tourism is a top GDP contributor, but wealth stays concentrated in large hotel chains and conglomerates
- Target user: unbanked, no digital presence, no Instagram or website, not on Airbnb
- Core goal: trickle down financial benefits to local entrepreneurs via a two-sided marketplace

#### Product Vision: Two-Sided Marketplace

- Supply side: local entrepreneurs list services (tours, food, transport, accommodation, security/concierge)
- Demand side: travelers browse, book, pay, and review local experiences
- Explicitly not competing with Airbnb or “best spots in Cape Town” Google results
- Authentic, community-sourced experiences (e.g. Cape Malay curry in District 6, Khayelitsha bicycle tours)

#### Core Feature Set (MoSCoW)

- Must have (supply side):
  - KYC/identity verification (Stitch API for MVP; manually verify one ID if no API)
  - Conversational onboarding: chat-style Q&A builds the supplier profile
  - Upload services, photos, pricing, meeting point
  - Manage bookings and receive payment notifications
- Must have (demand side):
  - Browse listings
  - View and book an experience
  - Pay for it
  - View booked experiences in an itinerary view
  - Review the experience (trust/verification signal)
- Nice to have (post-core):
  - Drag-and-drop itinerary builder
  - Crew voting on experiences
  - Stockvel/escrow group payment
  - Co-created itinerary with friends and family
  - Geofenced, audio-guided self-directed tours

#### Tech Stack and Architecture

- Framework: Next.js (full-stack, PWA-native, single repo)
  - API routes within the same repo, no separate backend
- Database: PostgreSQL (primary) + SQLite (offline/sync)
  - Offline-first: writes to SQLite, syncs to Postgres on reconnect
- PWA over native app: direct URL, no app store needed
  - Low-data, low-end phone compatible
- WhatsApp: use look and feel only (not actual WhatsApp Business API)
  - Meta constraints, cost ($1/message incoming), and approval risk ruled it out
  - Telegram considered for PoC but ruled out due to low penetration among target users
- Payments: QR code via SnapScan or similar; unbanked users receive via “Send Money” to cell number, redeemable at any ATM

#### Supplier Acquisition Strategy

- Not building for hackathon, but important to mention in pitch
- Options discussed:
  - Yazzie: community WhatsApp surveys, paid participants, aggregate local knowledge
  - Facebook community groups: organic recommendations from locals
- Framing: “aggregated community knowledge” to surface local champions
- Personal outreach model also discussed (go meet the entrepreneur, photograph, build profile) but flagged as unscalable

#### Team Structure and Task Allocation

- Team captain: Miles (visibility and communication)
- PRD + presentation: Miles
- Tech stack MD file (for Claude project): Henry
- Supply side frontend: Marlon
- Demand side frontend: Francois
- WhatsApp-look-and-feel onboarding PoC: Henry (time-boxed: abandon if blocked within 30–60 min)
- Centralized knowledge base: Claude project with shared artifacts (PRD, links, tech stack doc)

#### Branching Strategy and Ways of Working

- Branch structure:
  - main as trunk
  - feature/demand and feature/supply as long-running feature branches
  - Sub-features branch off the feature branch, merged back in
- Work tree approach: build components independently, pull latest and integrate when ready
- Avoid blocking each other: work on components in parallel, add “Lego blocks” when aligned
- Henry to scaffold the Next.js repo first; others pull and build from there
- Francois recorded the session and will feed transcript into Claude for concept clarity and PRD input



Meeting Title: Hackathon discussion #2
Date: Sep 18
Meeting participants: Francois du Toit

Transcript:
Speaker A: Yes. Trickle down into the lower. Yeah. Economy. Yeah. 
Speaker B: So it would be the distribution. So it's like the spread. Right? It's the spread. It's the decongestion almost like. Yeah. 
Speaker A: Well, it'll come to me now. The financial and technological exclusion. 
Speaker C: Yeah. 
Speaker A: In the tourism economy. 
Speaker B: Yes. 
Speaker A: So one, the touring economy is massive in South Africa. It's one of the highest contributors to our gdp. 
Speaker B: Yeah, sure. 
Speaker A: Yes. It's still a massive wealth divide. 
Speaker B: Yeah. 
Speaker A: There's still a massive pool of entrepreneurs. 
Speaker B: Yes. 
Speaker A: Local people that aren't able to contribute in this. 
Speaker B: Yeah. 
Speaker A: Because they're technologically excluded and therefore getting financially excluded in this economy. Yes. 
Speaker B: So therefore. So it's the financial and technological exclusion of travel. Therefore how do you bridge that gap? 
Speaker A: Yeah. And trickle down that money. 
Speaker B: Yeah. So. So it's this spread. Spread of financial benefits. Benefits. And I'd like the word trickle down. That's like something that connects Trickle down effect. I'm just writing like key phrases before. And it's also. 
Speaker A: I need to mention this. The. The size of travel and the. Yes. 
Speaker B: Okay so that. Okay, so that is the. Let's get a stat on that. Stats on the financial benefits at large. And then you want the trickle down to impact. It's also. Yeah. So the problem statement is that. 
Speaker A: Okay, what we're saying part of that stats is we need to research how much of that money is staying in big, big hotel. Okay. Kruger. These big massive business conglomerates. 
Speaker B: Yeah. 
Speaker A: That sure they are hiring local people, but you're not empowering locals to be able to contribute in this economy. 
Speaker B: Okay. So money in hotels and so. Okay. Any outcomes in Francois? 
Speaker D: Yeah, so it's definitely. You need a business account. There's just a point that they said that you meta may ask. I don't know what may means in this in the sense but I'll. That's part of what I'm researching. They might. May ask for business registration docs, proof of address, those kind of things. 
Speaker A: Yeah. 
Speaker B: Kyc. 
Speaker D: Yeah. 
Speaker C: Right. 
Speaker D: We can kind of. That's what I'm thinking. 
Speaker A: Find a friend. 
Speaker C: I just did one. One more thing. 
Speaker B: Yes. 
Speaker A: Price must have got us probably set 
Speaker C: Up as you're traveling. One pressing thing. Currency conversion. 
Speaker B: Currency. Yeah. 
Speaker C: Yeah. 
Speaker A: Ye. 
Speaker C: How. But how do we navigate? How do we interface? Because. 
Speaker B: Yeah. So it's like itinerary. 
Speaker C: So most people come to South Africa at each point in time and then you want to buy civilians. 
Speaker B: Yeah, yeah, sure. 
Speaker C: Yeah. 
Speaker B: It's the. It's the. It's the global currency wallet that. That is trending at the Moment people. Like a global currency wallet. So it automatically converts. 
Speaker D: Yeah. 
Speaker B: It carries your local currency, but then as soon as there's tap on a foreign machine, it actually does the conversion to the local. Yeah, it's like revolut and stuff. Like, do you know revolut? Yeah, yeah. So revolut and stuff. 
Speaker A: Do travel wallets. 
Speaker B: So. Yeah. 
Speaker A: One thing you must notice is the difference between features and the core problem. Sol. 
Speaker B: Yeah, yeah. 
Speaker A: So the judges aren't going to get blown away by features and you have a currency conversion. Important thing to have. Like what is the, what is the differentiator? 
Speaker D: What is the four? 
Speaker A: How are we solving what we throw into the platform? Extra jazz that comes in. 
Speaker B: Yeah, so, so what, what I was thinking is, okay, if we can't. So like let's not get caught on too many. We need a WhatsApp because then that's going to prohibit our progress. Right. We've got to think of if there's a problem, like what are the alternative solutions? And for me it's like the problem is that we may not get a WhatsApp thing in line in time. 
Speaker A: Right? 
Speaker D: We might, but we might end up. 
Speaker B: And we wouldn't want that as a blocker. So what I'm thinking is like we use, we, we state this as how do you source the local experiences? We use a community based WhatsApp survey through Yazzy to source local experiences and then a local representative actually goes to the entrepreneur and builds their business profile. Right. And then what we do is we actually just have the portal to create those local experiences as the local agent on the ground. Right. So we get the Yaz survey results and we say, okay, well Henry does the best. He has the voted by Woodstock residents the best walking tour. He knows the best about the second hand markets. Therefore, we go through and go to Henry, create his business profile on our platform. Right. And then we conduct business through WhatsApp thereafter. We send him bookings, we send him confirmations, payment confirmations, any travel requests. We actually just send it via WhatsApp thereafter. So what I'm thinking is actually more focused on the. More of the, like the portal, the composition of the experiences maybe. 
Speaker A: And we, yeah, if we are doing that, it does need to work. 
Speaker B: Yes. 
Speaker A: So it's sending through WhatsApp. 
Speaker B: Okay. Okay. 
Speaker A: So again, this is a prototype. So we can't give them a prototype and say we are going to send this through WhatsApp. 
Speaker B: Okay, but can you not send messages to WhatsApp? Do you know what I mean? You can have your WhatsApp you can have your web WhatsApp and you'd just send them. I have like a fake. I just changed my name on my WhatsApp to you know, Henry's walking guides. And then you actually just send me a WhatsApp message through the web portal. You know what I mean? But I. Yeah. So you emulate a tour guide. 
Speaker A: Yeah. 
Speaker B: Cuz that that's for me is like how we get around having a WhatsApp like business. 
Speaker D: So okay, so something that's coming back here saying that the cold outreach supply surveys, it's saying you can't message people who haven't got any. 
Speaker C: Yeah. 
Speaker B: Ye. 
Speaker D: The Yazzie model works because respondents messages the survey number first or this surveys are sent via SMS or another channel that doesn't have WhatsApp's consent restriction. 
Speaker B: Yeah, 
Speaker A: The survey is acquisition. 
Speaker B: Yeah, yeah, yeah. Like I couldn't add Henry to a group. He must have some setting on. So I couldn't add you to the WhatsApp group. For instance he. I needed to personally invite him. I couldn't have a global invite. 
Speaker D: Okay. 
Speaker A: Yeah. 
Speaker B: So there may be like a setting on but yeah that's acquisition and they prohibit that from spamming. 
Speaker A: Spam. 
Speaker B: Yeah. 
Speaker D: But doesn't that, isn't that a block from overs? 
Speaker B: Well Yazzie runs it's a very successful business. Like so that's what I'm talking about is like that is one way of sourcing the surveys like all of the experiences. Yeah. I'm keen to. Keen to problem solve. If you guys think that this whole idea is poop, we can scrap this. But we can also move on to another one, you know like so but I'm just putting out some trends and some thoughts about travel at large. 
Speaker D: Is there a feeling within someone else that we're over complicating this a little bit? 
Speaker B: Yeah, well we can. Yeah but that's the thing is I'm wanting to start wide and then they say like I heard the things recently is like simple is not basic. It means that you actually reduce complexity to a point where you're getting value. And that for me is like the most. So you're going to start very in like an inverted triangle. You're going to start at the top and you're going to work down. But I wanted to put a lot on the table. 
Speaker A: Yes. 
Speaker B: So we could choose a part of this. You know we could zoom in on a part is like maybe the trickle down impact, like triple trickle down travel. How do you actually get financial inclusion to local entrepreneurs could transcend This, I 
Speaker A: Mean, I mean even if it's just the supply side that you build, we exclude all the fancy features because that's the major blocker for a lot of these people that want to contribute and participate in the travel economy. 
Speaker D: Something that I'm thinking is that, I don't know, maybe I've missed the spot here and there, but we're trying to get, let's use the example of someone cooking Malaysian food in their house, trying to get their tourists to their house. In a sense, wouldn't it be a little bit safer to have these people come out to a local area or like a. Where a lot of businesses come together and then we just play the connection between the tourists and them actually getting people to the area and exposing the area and kind of marketing the area and saying here are the different types of services or products or whatever that you can, can't get there. Then it's more, you know, getting them that exposure but not exposing their safety 
Speaker C: To a point where they are the only people with. 
Speaker B: So you're like decentralizing the experience to a location kind of thing. 
Speaker D: That's kind of where I'm. Yeah, I'm trying to meet in the middle. 
Speaker B: The thing is that, that I'm just speaking from experience is that people want authentic experiences. They want to go into like the household of in District 6 and create Cape Malay Curry. 
Speaker C: Another thing is let's not limit it to like an experience of something that somebody's like making themselves. Let's say something that you can buy. Think of it as like you want to guided tour to just see what Khalid looks like. 
Speaker B: Yeah. 
Speaker C: So we can't bring Khalid out of college. 
Speaker B: Yeah, yeah. 
Speaker C: So it's more like different types of like experience. 
Speaker B: Yeah, yeah, yeah. I think a start would also be looking at Airbnb experiences to see how they like packages. See like what is, what is done there. Yeah. It's a market that for me is 
Speaker A: Too basic and that's the demand side. Yeah. The real soul. 
Speaker B: So. 
Speaker A: Yeah, yeah, it's the supply side. That's where the exclusion financially and technology comes in. Yeah. 
Speaker B: This is the thing that we were saying. Yeah, this, you were on the PC, but the problem statement is financial and technological exclusion of travel. Right. And how do you create a spread of financial benefits and create a trickle down impact or effect on the huge money spent on travel? 
Speaker A: I think about all aspects of travel. Like you mentioned, we have experiences. Yeah. Maybe accommodation. Yeah. Travel guys with 10 buses, tuck, tucks, whatever it is, transport solutions. We have safety. People can sign up as security guards 
Speaker B: Or you know, 
Speaker A: Whatever you call them while they travel to sort of look after them. Concierge. So we can hit all those aspects of travel but focus it on local community and businessmen that can list these services and connect the wealthy, European, American, even locust African travelers to these people. Not just experience wise accommodation, food, restaurants, local businesses, anything like that that wouldn't feature on Airbnb or when you Google best spots in Cape Town. Yes. 
Speaker B: Okay. Well, yeah, I'm thinking of the WhatsApp thing. But. But it's like, like not saying it's a business account. Why don't we just say like you have a Web browser for WhatsApp and then we add someone like who changes their WhatsApp name and has like Miles's walking guard, Henry's tours, whatever. And you just messaging with the AI bot. Any confirmation of travel or any confirmation of a tour or booking or anything. Like a payment. 
Speaker A: Yeah, the comms. 
Speaker B: Yeah. 
Speaker A: Notifications. Yes. 
Speaker B: But you actually need to fetch. I think this is like the person needing to go and get there. You know, I'm talking about the green market experience where they actually go and source it from the people. Like tell me about your walking tour. Let's go on it. I'll take photos, take you, film you, and then I'll create this experience. But again it's the marketplace. 
Speaker C: Yeah. 
Speaker A: That's the acquisition. 
Speaker B: Yeah. 
Speaker A: Which we can mention proposed solutions around that, but I don't think for a hackathon product we need to build. Oh yeah. How we get the user acquisition isn't the most ending part. Yeah. But it's important to have. 
Speaker D: Yeah, I think. 
Speaker B: Fair enough. 
Speaker C: Okay. I think the onboarding of the service providers is what we need to focusing on. 
Speaker A: Yeah. 
Speaker C: Getting. Getting our product like visible to the supplier. I think that's something that marketing team of places we have to do. So if we can make the onboarding seamless by having like, let's say like airborne, we'll make it as simple as possible and guided as possible to get verification done and to get them to load their experiences in their products 
Speaker D: Also 
Speaker A: To run the business. 
Speaker C: Yes. So if they can. If we can sort that out, I think we are golden. Yeah. 
Speaker D: Right. 
Speaker C: From a supplier perspective. And then we. I'm thinking about Yazi, like for example, like we. That's trying to show more of like a exposure or marketing so we can maybe simplify and we can. I mean. Yeah. 
Speaker B: The thing is what is the core product at the moment. Yeah, that's what we need to figure out. 
Speaker A: This is decided Marketplace, supply side. How do we solve people that are technologically excluded? Give them a way to put their services business on a platform where tourists can view them, book them and pay these people directly. 
Speaker D: Okay, so let me write this down. 
Speaker A: Yeah. If that is the idea. 
Speaker B: I mean should we just ask people to make it. Eh. 
Speaker C: Okay. 
Speaker A: And look, I agree, maybe it doesn't have to be WhatsApp, but if you can use WhatsApp as a comms booking confirmation payment been made. 
Speaker B: But what if we just have those, those templates of the messagings ready and then trigger it and send it to me. Literally me on stage being like, I am the tour guide. Okay. I have a booking. 
Speaker A: Yeah. 
Speaker C: So send messages. 
Speaker B: You know what I mean? Like get some level of like oh, bookings come in. I get notified on my phone. I'm gonna meet the guys. 
Speaker A: You know you could still build a web portal. 
Speaker B: Yeah. But the more interesting part is going to be the, the actual website that gets built. 
Speaker C: Yeah. 
Speaker B: It's like instead of that, we need to be building the side that where you are making ascending. This is my business. 
Speaker C: Yeah. 
Speaker B: And then it builds the website. 
Speaker A: Yeah. 
Speaker B: That's the 
Speaker A: Listing on a. Let's say an Airbnb is the platform we have for our demand side. So our tourists in South Africa, they will list that and Bubble will be able to go there and see Marlon runs a tour guided business. Yeah. And this is rates. This is the description. Yeah. Which is book it. You get a notification through WhatsApp saying hey Bob and Joe on the six to go back. 
Speaker C: Can I just like ground us again so that we moving in the direction. So number one, we need to have a team captain. I mean I think we already have established that by now. I think I'm happy with Mr. Miles. 
Speaker B: Are you guys happy? 
Speaker D: Yeah. Okay. 
Speaker C: I'm happy. 
Speaker B: Yeah. 
Speaker C: So team captain. So you can visibility and communication. 
Speaker A: Yeah. 
Speaker C: Second thing is, can we now write our finalized so problem statement. 
Speaker B: Yes. 
Speaker C: And then our solution so everybody knows. 
Speaker B: Yeah. 
Speaker C: Yeah. 
Speaker B: We were just getting it. Really getting to it. Yeah, we're getting to it. I, I like your ambition and the coffee is working. So. 
Speaker C: Yeah. I want to make sure that like we've got it. 
Speaker A: Yes. 
Speaker C: And then we can refine from. 
Speaker B: Yeah, I agree. But we were just getting to what we were building. Right. And so I think what I'm, what I'm getting at now is that are we going to be doing this, Are we going to be doing, you know, this, this drag and drop itinerary based stock fill funded impact based experiential travel platform like, that's what I'm going to 
Speaker C: Ask because for me it feels like it's a lot. 
Speaker B: Yeah. 
Speaker D: Like, even with AI, I think we can't say Fable because it's going to be 20 minutes and fable is going to be. 
Speaker C: I mean, we can use Opus 4 points 
Speaker A: Again. I think that itinerary side is a feature in the customer marketplace. Yeah. So the base idea is do they have a view where they can see all of the listings? Yeah. From there, what features we add on. If we get time, we can be like, hey boys, we got time. Let's do this cool itinerary builder where we can. Or let's bring in currency or whatever it is. 
Speaker D: I think a good Moscow list will be vital. 
Speaker B: Okay. But I have to. Then challenge is if. How quick can we build these things? With AI, we can build these things quickly. 
Speaker A: So you should have a feature backlog of. 
Speaker B: Yes, this is core. 
Speaker A: Yes, this is working. 
Speaker B: Okay. All right, so let's. Should we do a little bit of a Moscow framework? 
Speaker D: Yes. 
Speaker B: Or should we. Session two, we are running slightly behind 1045 on session two with Rockbo and Rashburg. For those that would like to attend that. 
Speaker C: Okay, 
Speaker B: That's happening in five minutes. You welcome to grab a chair on that side. All right, so help me out, guys. So. So what do you guys want to build? Because it must be a. Everyone must be happy with what we're building. At the end of the day, it's. It's about experience of the hackathon and having fun. So, you know what I mean? Like, if we can push something out that we're happy with, it doesn't have to be super complex, but I do feel that it needs to be. We need to supply experiences and we need to. To experience the experiences. So how do you. How do you meet that? Yeah, with a basic set of features. 
Speaker A: Yeah. 
Speaker C: So from my side. 
Speaker B: Yes. 
Speaker C: I'm happy with what we discussed. Like, yeah, I don't want to like, leave anything out because I think this could be a very comprehensive, like holistic, like mvp. 
Speaker B: But yes, I like the approach of 
Speaker C: Like, because we are time cap and some of us have got commitments in a disconnect, etc, so we'd identify our core features, but I don't think we should leave anything. 
Speaker B: Okay. 
Speaker C: I think they're. 
Speaker B: Let's be optimistic. 
Speaker C: Yeah. The Stop your idea. I love it. 
Speaker A: Yes. 
Speaker B: Right. 
Speaker C: Being able to click onto the experiences, having people drag and drop, I love all of that. 
Speaker D: I think that's gonna make the. 
Speaker B: The actual product very tangible. Yeah, yeah, yeah. 
Speaker C: So but of course, let's identify our four features and then we can work away from that. 
Speaker B: Sure. So I'm gonna write here supply. Right. Dave, you guys are familiar with the term or why I'm doing this? So the supply is creating is the engine. Right. And then the demand is people who come in, the travelers come in and they. They're creating the itinerary and experiences. Right. So perhaps we could just whittle down what you feel are the core features of both sides. What do you guys think? So the supply, technically, some. The. 
Speaker D: The onboarding flow is quite important. We feel like they are in. 
Speaker B: Okay, perfect. So onboarding of experiences or sourcing. Right. So this is onboarding. Right? Sourcing experiences. 
Speaker D: Right. 
Speaker B: That is a key one. What do you think, Brandon? Yeah. So how. Yeah. Okay, so that is core, right. So it's. How do we do it? You know that. That is the thing. Is. Is it the Yazzie? Is it the. What is it? How do we. How do we actually source the experiences or the entrepreneurs or the tour guides? 
Speaker A: I think it starts before that is one. It's your profile set up. So we need to verify that you are. 
Speaker B: Okay, that's onboarding real person. Yes. So that's kyc. That's kyc, right. 
Speaker A: Not this random guy that's going to. Come on, you can't hold you accountable. 
Speaker B: Okay, so that's a KYC check. So that's to verify. Are you guys familiar with kyc? Know your customer. So it's a global person in check. They have a global database of blacklists, red lists, financially barred, politically connected people. They actually ban people from signing up to banks. So. So we've just got to make sure that they are past the KYC check and then they onboard it and then they can create the experience if they want to. 
Speaker D: I mean, I've literally not done anything KYC related. Okay, Is that something that we should actually literally like call? 
Speaker C: Is it like a database or something we can emulate? 
Speaker B: We can emulate a kyc. Right? 
Speaker D: This is the part where I'm like, how much are we emulating and saying, oh, this is what it can do? 
Speaker B: And it's actually. 
Speaker D: It's not there. 
Speaker A: So Stitch. Stitch is the local one that people use. 
Speaker B: Yeah. 
Speaker A: So Stitch. Yeah. So they. It's an API. You tap into. It is a paid API, but it's API. You tap into your identity verification. Yeah. Upload ID number and they check all the sources for KYC and that validate 
Speaker B: You as a real. 
Speaker A: And then from there. 
Speaker B: Okay, yeah, like. Like Vice has Been doing it for Unkele. To get a loan, you have to have kyc. You take a photo of yourself, you'll smile. It's called Smile ID or True id. And then it goes bang, bing, bomb. And it checks your backing records and does like three checks. Financial, criminal record, financial, and then your actual face verification. 
Speaker D: But that onboarding man has two lanes, doesn't it? It has the verification of the person and also then the start to go. 
Speaker B: All right, so is breeze coming in yet? Very cold. Okay, so what's next? So are we assuming that we're going to do kyc? 
Speaker A: We have to at least ask for details. Even if we can manually verify it. So you can say, look, mvp. We manually verify one ID number. Finally going to stitch and take it to real. 
Speaker B: Okay, so let's say. 
Speaker A: But there's no API. 
Speaker C: Oh, gosh. 
Speaker D: Okay. 
Speaker A: Okay. 
Speaker B: All right, so that's. That's cool. 
Speaker C: Thank you. 
Speaker B: Are you all done? Okay. All right, so that's. I'm assuming we can do something like that. Then we need to move on to. But I still think of sourcing of them. How do we actually. Before we came. I see them. How did we find them? I think there's something around the Yazzie surveys, the local surveys, because it's like, how do you connect a local source of knowledge? You know what I mean? Like, who's making the best suits? Who makes the best curry in the area? You know, who does? Who knows the area best on bicycle? Like asking your communities, like four champions. That for me, is something, you know, that. That I connect to. I don't know. 
Speaker D: That's a lot of manual work. But the first thing that I do when I need a community opinion is go on a Facebook. Facebook group. Seriously. It's like where all the moms and the aunties are. But that's where people have opinions about their little community. If we can do. It's another brain. 
Speaker B: People are sending local. Where can I get my clutch? 
Speaker D: Yeah, there's two sides. There's a recommendation and then there's, oh, I'm a scallop that wants to put my in this battle. Yeah, I would rather want to go for recommendation of 50 people. 
Speaker B: Yes. But that's what I'm trying to say is, like with the WhatsApp thing, the surveys is that you're getting aggregate data. You're not just getting like three people being like Joe's ma, but it's actually just his family saying it's the best curry. You know what I mean? Do you know what I mean? Like, and if you're asking a hundred people and they're saying, you know, Tina on the corner makes the best Samusas, you know, that's one thing. But anyway. 
Speaker D: But the thing is we know very little about. 
Speaker C: I mean, we can do research. 
Speaker B: Let's look at Yazzie. Let's just look at Yazzie. 
Speaker D: Because how they get there, how do they get the data? If I get a random survey. 
Speaker B: No, they get paid. So you sign up to Yazzie as a podcast participants and then you get paid per survey. And it's actually doing very well, just for FYI. Yeah. So. So let's just research that. 
Speaker A: I would say that, that mark that as user acquisition. Okay. We're not going to build yet. 
Speaker D: Yeah. 
Speaker B: But we're going to tap into the engine. But that's how you source. But that's how you get the experiences. But not. It's a wouldn't use user. So for me it's like. I guess it is user. It's. It's like. No, it's quite tricky to phrase it, but I guess it's the people. Yeah. 
Speaker A: How we bring supply to our. 
Speaker B: Yes. The supplier acquisitions. There we go. 
Speaker A: Okay. 
Speaker B: All right, so then once that's in. 
Speaker C: So we've. 
Speaker B: We've got some level of. Whether it's Facebook or Yazzy, some level of aggregated community knowledge. And I think that that's. That is. That is the word aggregated community. Because that's where it sits. Okay. Community knowledge to gather experiences. Okay. All right, so once they have that, then they. We find them through Facebook or Yazzie. Once they are signed up or commit to it, we then KYC them. But then it's like, do we. How do they create their profile? That means to submit an experience. Right. Is that where we have the personal outreach? Is that an AI generated call center? Like, what is that? 
Speaker A: We'd have to build a platform. Yeah. So initially, before we can do WhatsApp based, would have to be set up your profile. So registered. I'm okay. KYC done. Take my photo. I'm a real person. 
Speaker B: Okay. 
Speaker A: What do you offer? Yes, I offer guided walking tours around cooking classes for X, Y and Z. I do that. They set up those ceremonies through whatever front end portal 
Speaker D: Through the. We can do that through the box. 
Speaker B: I have an idea. Yes. Yes. Someone who calls you and is able to like interview you and they build out your profile. 
Speaker A: Oh, just talk to an AI. 
Speaker B: Yeah, that's what I mean. 
Speaker A: You don't have to go type there, say, I'm offer This one. Recommend these four services. 
Speaker D: You also want to just go back to the non tech app. I haven't seen that. Actually removing the AI layer from. From that is kind of my initial. 
Speaker B: Yeah. 
Speaker C: Like having a pot. 
Speaker D: They should ask you question by question. Say there. What's your name? Pete. You do sell bananas. And then those answers eventually get compiled. Okay. Simple. 
Speaker A: The negative. 
Speaker C: True. 
Speaker B: Right. 
Speaker A: Where you're onboarding and set up is all three chats. Okay. What's your name? John. Exactly that. 
Speaker C: Yeah. 
Speaker A: Yeah. 
Speaker B: That's cool. So that's why I'm thinking like, how do we. 
Speaker C: I know. 
Speaker B: It's that we should we not emulate WhatsApp? Is that not. Is that not. Is that against the rules? 
Speaker D: That word freaks the out of me. 
Speaker C: So when you say emulate, like simulator. 
Speaker B: WhatsApp conversation. 
Speaker A: We can make the interface. That so. 
Speaker B: But that's what I'm saying. 
Speaker A: Simple. It's low data, which we would have to think of if we aren't using WhatsApp. They start, say, okay, get set up and then you enter chat. 
Speaker B: Yeah. 
Speaker A: Not WhatsApp. Okay. Chat starts with hey, what's your name? 
Speaker C: Sure. Cool. 
Speaker A: We need this, this, and this from you. Can you upload it? What do you want to offer? Yeah. 
Speaker B: What's the price? Where do they meet? What do they need to bring? It's like an onboarding of experiences. There's like 10 questions that ask in a conversational manner and it builds experience. This is the important part. Like, you shouldn't focus too much on displaying that whole process. Okay. 
Speaker A: Yes. 
Speaker B: Okay. So they're onboarding your form. Yeah. So we don't actually show them. We show them like 10 sample questions or something. Okay. All right, that's cool. So this is the, the onboarding of experiences. Okay. I like it. 
Speaker D: Also, I just want to throw something technical on the table. 
Speaker B: Yes. 
Speaker D: Maybe we don't have to go for what's out for this right now. 
Speaker A: That's what I'm saying. 
Speaker D: We can maybe use. But we can maybe use Telegram, because Telegram might remove a lot of the constraints that the whole meta. 
Speaker B: Metaverse. 
Speaker A: Yeah. 
Speaker D: Telegram is literally like, if you spin up Telegram and someone. 
Speaker B: And. 
Speaker D: And someone starts up your bot, you can message. 
Speaker C: Yeah. 
Speaker D: It's not. It doesn't have this privacy. 
Speaker B: Yeah, I know. I mean, 
Speaker A: Do the target supply customers use Telegram? 
Speaker B: Do that. Does the bicycle tour guy use what Telegram? 
Speaker A: Generally not. 
Speaker D: No, that's. I mean, I just pulled a quick statistic. 
Speaker A: It's. 
Speaker D: It's like WhatsApp blows it out the water. I know that, but I'm thinking like 
Speaker B: If you're looking at highest penetration. Yeah, yeah. 
Speaker D: I'm thinking proof of concept. 
Speaker A: We can tell them this would be WhatsApp. 
Speaker D: This would be WhatsApp. 
Speaker A: We don't have a. 
Speaker D: We just want to kind of get it there. 
Speaker B: Right? 
Speaker D: Yeah. 
Speaker C: But why. Okay, so. So I was a little bit distracted. But why aren't we just doing a WhatsApp? 
Speaker D: Because the unknown with WhatsApp is definitely, I promise you way more than with Telegram. Telegram. You spin up the bot. It can message a person. It doesn't have these weird blocks with like groups and stuff like that. Meta is like the Apple. The Apple Store of that hits the fan. 
Speaker B: There's regulation and so halfway through the 
Speaker D: World we might run into problems. 
Speaker B: The idea of using it as a example. 
Speaker D: Yeah. 
Speaker B: Just so that they can actually see. Yeah, that's cool. 
Speaker A: And then. 
Speaker B: Yeah. Install the same WhatsApp. Let's just say that we're going to use WhatsApp and then say we do the acquisition via WhatsApp with a basic conversational basic onboarding with the. With the user. 
Speaker D: Then that. 
Speaker B: That preloads the experiences. No, he's a judge. 
Speaker A: Brain for the there. 
Speaker B: Yes. 
Speaker A: Payments is also going to be quite a big thing we need to think of. 
Speaker C: Yes. 
Speaker B: Can we use Yoko? 
Speaker D: Can we use Yoko? 
Speaker B: He's head of judge. Yeah, he's a head of Pay or SNAP Scan. Yeah, my girlfriend's head of product at Snap Scan. So. And they actually doing. If they're actually doing a community play. They actually are doing it. So like spazo shops, football tournaments and stuff. They are actually doing it and it's also event based. So it's like you get allocated a QR code, you pay through it it through WhatsApp. So. 
Speaker A: Well, we don't even need to build a payment portal on this. 
Speaker B: You just say it's done by us. 
Speaker A: They generate a QR on arrival the guests. Yeah. But then I guess they have to have snaps down in the international. 
Speaker B: No, it actually has. There's a universal payment method with QR codes now. 
Speaker A: Yeah. 
Speaker B: So I'm just saying it actually is Ambigu ubiquitous to a service provider. 
Speaker D: Oh. 
Speaker A: Each the merchant supplier has their own unique QR code. Yeah. And on every service instead you pop 
Speaker B: Up up that QR code. That's what they do now. That's what she did in Ky on the bicycle tour is. Was the QR code payment cooking. 
Speaker D: Okay. What if the business doesn't have a bank? What if they don't have a bank? 
Speaker A: Yeah, true. 
Speaker B: Yeah. Well you can do send Money. Can you send money to ATMs? Can they send money? 
Speaker D: Probably, but it's a lot for us to navigate now because remember, we're playing 
Speaker A: In the space of unbanked. 
Speaker D: Unbanked, no technology. 
Speaker B: Yeah, but, but it doesn't help. 
Speaker D: We do the 10% of that. We need to cater. 
Speaker B: But remember, send money. All you need to get it. I don't know if you guys have done it. The only thing you need to do is a cell phone number. You can go to any ATM and you can get your money out of it. So that is how you do it. You just send money and you through to the cell phone number to address the non bank. I think that is. You see, it's a coin that comes. That's what we use. Okay. 
Speaker C: Capital send money doesn't need you to have. 
Speaker A: Exactly. 
Speaker D: Phone number. 
Speaker C: You just send cash and then you just get a voucher number and you 
Speaker B: Put it in an atm. 
Speaker C: Just put that in our problem statement. 
Speaker A: We need to mention the unbanked. 
Speaker B: Yes. 
Speaker A: Part of it. 
Speaker B: Yeah. So that's the exclusion of technology there. Technology is unbanked. 
Speaker A: It's not only the listing platforms, the Airbnb, the website, it's the, the UN banks. 
Speaker B: Okay. We need to do a slide on this. We need to do a slide on the. Where the, the, the, the user profile we are addressing. And, and they are unbanked. They don't have a website. They don't, you know, have a digital presence on Instagram. And that's who we address. We're not, we're not doing the shiny Instagram pages with the five star website with the virtual tour of the hotel room. We're not doing that. Right. And that, that's, that's, I think. Where we going? 
Speaker A: Yeah, we're moving. 
Speaker D: We're moving. 
Speaker A: Okay, so you speed run these features. 
Speaker B: Are you onboarding? 
Speaker D: Yes. 
Speaker A: Okay. 
Speaker B: Are you signing up now? 
Speaker C: I'm a little bit. 
Speaker B: What's, what's. Okay. All right, all right. So we've got onboarding. We're doing the experience. So how do you capture the experience? That's the, the more of the challenge is the photo of what they do, like him on a bicycle or the route that he's going through. Khayelitsha. How do you actually get, get someone to understand what they're doing? 
Speaker A: This is where I think we can bring an AI. 
Speaker B: Yes. 
Speaker A: Okay. Based on their responses, we generate an AI cover or they can upload a photo. 
Speaker B: Yes, I'm, I'm doing. I'm also wondering about the fetching of it. Is that. Are we not doing Green Market Square when they actually go and fetch the photos from the person? So that's how they vet them is they go and they meet the person in person. 
Speaker A: Let's see if we can run some scale issues and go to it. The more people you on board, the more people you need to go and validate. Yeah. This could be a self serving marketplace where you don't need to do that. 
Speaker C: Okay. 
Speaker B: And AI can vet if the photos are real, authentic or not or generates them. 
Speaker A: Yeah, but it would be better to have photos. 
Speaker B: But then, then you run into a problem quality issues like photos. But anyway that's small issue. So let's say it's user generated content. UCG experience. But do we. 
Speaker A: Because you're going to want a photo of the person as well. Yeah, that's quite important. And we take a photo and invite 
Speaker B: For our kyc, right? 
Speaker A: Yeah. You can solve that. 
Speaker B: Yeah. Okay. But that is, that is a. That is a challenge we need to address is how do you onboard experience, how do you capture the experience? 
Speaker D: I think we need to flag the challenges somehow. Is that the arrow? 
Speaker B: Yes, that for me is the problem statement. I'll put a question mark here. 
Speaker D: Yes. 
Speaker A: Yeah. But feature we got, we got register and create profile verification. 
Speaker B: Yes. 
Speaker A: They need to upload their services. 
Speaker B: Yes. 
Speaker A: You can manage their services. 
Speaker B: Yes. And is that through a portal? 
Speaker A: Initially it would be, but then the ideas for WhatsApp you need to have a way eventually. 
Speaker D: Again I, I want to say that I think it's possible through like a bot already. 
Speaker B: What if you do a progressive web app? Yeah, that's, that's so it's so it's on the phone. We don't need to use WhatsApp offline modes. Possible. We can also make sure that it's adaptable to low end phones. Yeah. So WhatsApp I think is a squeeze point that we're realizing it's a friction point here. So maybe we say it's a PWA. We can spin PWAs up pretty quickly. No. And can't we post one via Android Store? I know we just did one for food lovers but it takes some time to create an internal testing mode. 
Speaker A: I don't think we need to put it on app stores. 
Speaker B: Okay. 
Speaker A: Direct URL. 
Speaker B: Okay, so let's do we go for pwa? That's just the guys. But it has a conversational component. It feels like WhatsApp. So I think that is the gate is that we want it to feel like WhatsApp so people feel like they can Use it. Right. And that's what I think. Why are we thinking about WhatsApp? Because of the ease of. 
Speaker A: Of it. All of our cred are conversational. 
Speaker B: Yes, conversational. And also like, also adding photos like WhatsApp. You know, when you share photos on a community group. Yeah. That's how we're going to add the photos and then AI is going to generate the experience. It's going to go where you are. Drop your pin. 
Speaker C: So, yeah, so here's what I was thinking. 
Speaker A: Y. 
Speaker C: The. So the tech component, like on our site, on our app. 
Speaker D: Right. 
Speaker C: We already. We're planning to have onboarding because, you know, for the traveler. 
Speaker A: Okay. 
Speaker C: A lot of the demand side. 
Speaker B: Yeah. 
Speaker C: But of course we were going to build a supplier on board and on that, I think that's good. We can go to pwa. Right. That will handle both suppliers. But we still need much like what they did with ankle. You can still go directly, you can register and do everything, but you can still do it also via WhatsApp. So I don't want to neglect the WhatsApp option because, I mean, almost everybody's using WhatsApp, especially mention it. 
Speaker B: We can mention it. 
Speaker A: Yeah. We'll say the eventual goal is to get supply side. 
Speaker B: Yeah. Because like, like you said, like what Ankela did is they, they started off on WhatsApp and then they actually also built an app. Yeah. 
Speaker C: What's the challenge with us now? Like, what's important? Like, why are you guys wanting to move away from what. 
Speaker B: We can't. We can't create a WhatsApp bottom. We can create a look and feel of it with AI very quickly. We can say, you know, if WhatsApp was a channel we can move across, but remember, this is a commercial thing as well is that Meta is actually going to be charging $1amessage on WhatsApp soon from all brands. So there's also a huge cost implication. Right. So if we can abstract away from the cost of WhatsApp, because now they're free, but next year apparently they're charging $1. 
Speaker A: But we can say that that would be the next evolution to bring that on. 
Speaker B: Okay. I like it. Is that all right, Henry, you happy with that? 
Speaker C: Yeah. 
Speaker A: Yeah. 
Speaker B: So. So we're going for the look and feel of WhatsApp, so people are comfortable with using it. But it's a PWA for now. Is that all right? 
Speaker A: Features, jets. Okay. 
Speaker B: Yeah. So. So we're getting there. Okay. So it would be survey or conversational onboarding. Yeah. Okay. Okay. So then this is also. Yeah. So then you can also mgmt management of experiences. And then it's also like plus adding content or media, like attaching images in WhatsApp. WhatsApp. 
Speaker A: Okay. 
Speaker B: Is that all good? All right guys, what's happening here? 
Speaker D: He's playing. 
Speaker B: Okay, Was that last one you set out Edward Scissorhand? 
Speaker D: The notes aren't going to make sense now at all. Okay. 
Speaker B: But basically we, we're going for the addition of an experience via WhatsApp onboarding conversational. Attach photos of your experience and then Bob has a tour through Woodstock. Okay. And then that's the supply of them. You can also manage them. You can attach prices, everything like that. And then the demand would be, I think that would be that nice sticky drag and drop itinerary. You can search experiences as friends. Create your itinerary. Co create your itinerary. 
Speaker D: Well, that is the other side of the coin. Yes, that all has to be built out. 
Speaker B: Yeah, but that's, that's quick guys. Like let's, let's be real. 
Speaker A: Okay. 
Speaker B: Co create itinerary. Invite friends and family. Right. Friend FNF Invite friends and family. It's a, it's a, it's a visual timeline. Right? Okay. Then you, you drag and you search for experiences that speak to you. Search interests and passions because then that will bring up your experiences that align to your interests and passions. And that's to fuel your experiential travel. Right. Then you add to timeline and then your, your crew votes. Crew votes which experiences. Okay. And then they, then you have a stock fill like funding payment approach. And this is like far in advance. So that's what we were thinking. It's like a co created itinerary. You invite your friends and family, you have a visual timeline. You search in your interests and passions, which brings up the experiences. Then you add them to your timeline. Your crew votes for the experiences they want and timeline. And then there's a stock file payment approach. 
Speaker C: Where does the money, where is the money going to sit? 
Speaker B: It's in like a escrow account. 
Speaker D: Okay. 
Speaker B: So yeah, I'm just trying to get some. I need to run to the bottom now. So will you refine this? Just chat them through these 
Speaker A: Itineraries, visual timelines, crew voting, stock file features. The core features are can I browse these listings, can I book them, can I review and can I make a band? That's is the first stuff we need get right. And then from there we bring on. Cool. Can you now build an itinerary? Say I want that experience in the morning. In the Day, get lunch, those sorts of things. So I'd say the first thing we'd have to get right is can I go into a marketplace, see all these listings, Can I click into it, view the listing, can I book it, pay for it, see it somewhere on this is my itinerary. These are the things I've booked and doing and then afterwards review it because reviews are super important as well. Trusts verification of the actual service providers. Then we can bring in like stock file crew, voting, collaborative discovery on the marketplace. Does that make sense? 
Speaker C: Yeah. What do you guys think? Sounds good. 
Speaker D: Sorry, really? Because yes, he's here now. Just run through that, that core flow just one more time. 
Speaker A: Can you browse these things? 
Speaker D: Yes. 
Speaker A: Can you book them, can you pay for it? Can you view it somewhere in the itinerary and then can you review it? That's like the full set of baton works. That's how you those and then we bring all the features of yes some 
Speaker B: Valve crew boats and yes, those sorts 
Speaker C: Of things you want to list out just those core journeys basically. 
Speaker B: Yeah, yeah. 
Speaker C: So I think let's do that, let's test it out and then we can identify. 
Speaker B: Well he's got them. Don't you have them? Yeah, yeah. 
Speaker A: Browse book review. 
Speaker B: Yeah. So is there yeah for me that it may be a nice to have feature but, but the word co create. Yeah cuz I think that's where you, you are being self guided cuz I think too many tours are rigid and and France going to Turkey next week and it's like six days or seven day travel and there's no modification and it's like this is where I think if a group of friends are able to just tick, tick and then say next. Like for me it's a nice to have maybe but I think that's something where you can customize because a key word with travel is personalization. Yeah. So personalized co creative itinerary. Yeah, something like that. Okay. 
Speaker A: So they are two sided marketplace, supply, demand. Supply side is registering onboarding, verification, tracing your services, managing it, getting payments, managing your book things. 
Speaker B: Yeah. 
Speaker A: Or demand side is can I browse them? Can I view it, can I book it, can I pay for it, can I review it? And it's simple as for then all 
Speaker B: The jazz and then every day like let's, let's jump forward. Imagine you're on the travel and you open the app, the PWA every day your crew gets notified of what's happening that day and all offline and then it has your self guided tours and all your your guys meet up with you and it's audio based. So geofence, basically you meet up at a mark, they meet up at a mark and then the experience occurs. What do you guys think? 
Speaker C: Yeah. 
Speaker B: Yeah, but that's nice to have future. So if we have time we can maybe go into the. On the travel like. But yeah, let's see. So should we. Should we get fable dancing or how 
Speaker A: Should we do it? Well, how we. Because we got two sides. 
Speaker B: Yes. How should we dubious. 
Speaker A: How are we gonna this up and 
Speaker B: Okay, hold it all. Okay. 
Speaker A: We have a supply side and demand side. 
Speaker B: Yeah. 
Speaker A: We have three devs. Designer, product owner. We have a presentation we need to build. 
Speaker B: Yeah. 
Speaker A: That will go alongside it. That sets the the scene problem statement. Okay. How do we want to set it up? 
Speaker C: Okay. 
Speaker B: Okay. Ways of working. Let's discuss ways of working. Okay. We all have claw, right. We have a project as well. 
Speaker A: Okay. 
Speaker B: Okay. Wait, Henry, are you on board? 
Speaker C: Yeah. 
Speaker B: Okay, we all have flawed. We all have the hackathon projects. Right. Are you able to access it? Able to access it. Okay. So I think we've got to start there. Right. So I'm gonna. I think it would be best if we start doing some threads within that project that we can all see. Okay. Or at least have a project like knowledge, right. Where we do a write up on what it is. 
Speaker D: Okay. 
Speaker B: And then I'm gonna ask that we all add to artifact or like the actual little document section of Claude that we add in what we come up with. Okay. Like someone's going to own the pwa. 
Speaker A: Okay. 
Speaker B: We're going to put the address there and maybe like a link to it. So that will be in the actual project memory. Okay. 
Speaker D: So you're thinking about spinning up little 
Speaker B: Prototypes or just a prototype. But I'm saying it's like. All I'm saying is Claude. And the project is a centralized spot of knowledge. So like what we're working on, what you know, maybe tapping, creating some. Some work on it. Yeah. What do you guys think maybe the 
Speaker A: Starting point should be our prd. 
Speaker B: Yeah. 
Speaker A: That is kind of what you're saying. 
Speaker B: The prd, the system, these are the features. Yeah. 
Speaker A: This is how it works. 
Speaker B: Yeah. 
Speaker A: And then that's all sits in the repo and Claude, everyone references that same prd. 
Speaker B: Okay. 
Speaker A: This is the system. 
Speaker B: These are the features, this is the 
Speaker A: Functionality, this is supply, this is demand. 
Speaker B: Okay. Okay. Then 
Speaker A: I would say we need to split up someone doing supplies. 
Speaker B: Yeah. Who's comfortable with like PWAS etc. Are you? 
Speaker A: Yeah. 
Speaker D: Yeah. 
Speaker B: Okay. 
Speaker C: I mean I'm also building PWAs every day. 
Speaker B: Yeah. Okay. 
Speaker A: Yeah. We need the initial tech stack. 
Speaker B: We need the tech stack. So can you own Tech Stack Stack? 
Speaker D: I mean, let's discuss it. 
Speaker B: Yeah, yeah, yeah. Well, what is the tech stack PWA react. That's probably the we also. But View is good for. For PWAs view. 
Speaker C: So what you simply need for a PWA is just the web manifest and 
Speaker D: Then you need your service worker file. 
Speaker C: So that's pretty much like what you need. Right. And of course it needs to be via an HTTPs connection so it's secure. So those are the three things that you need for the pw. 
Speaker D: So it. 
Speaker B: Can we set those up though? 
Speaker D: Yes. 
Speaker C: I mean just a web manifest, it tells basically. So you need a web manifest that tells your Mac or your phone what icon to use, what colors and things to use. That's pretty much it. Service Worker gives you offline functionality. Sorry, go ahead. 
Speaker B: Three things. 
Speaker C: Yeah. And then of course when we. Using the actual PWF going to be installable, it needs to provide secure control connection for HTTPs and that's pretty much it. So we can spin it up now and it's. Yeah, it's very simple. So it doesn't need to matter like react so happy with that. 
Speaker B: Just to add. 
Speaker D: Sorry. 
Speaker B: So the, the actual app is going to be three people possibly. Right. Because it's going to be the supply and the demand and then there's going to be the back end, the storage. 
Speaker C: We need a back office as well. Like that's an admin panel for. 
Speaker B: Yeah, but if we, if we didn't. 
Speaker A: Yeah, yeah, okay. 
Speaker B: Sorry. Then there's the, the. The. The presentation part of it. So like we need someone that's actually setting up what the problem statement is. Yes, I can do that. How everything's going to. Yeah. 
Speaker C: Y. 
Speaker B: And then there's one more part. What's the other part? Three things. 
Speaker C: Okay, so are we skipping like, I mean, can I try and work on a bit of a PoC for like the WhatsApp? Because I feel like this would really sell it and it's really gonna integrate well. Or do you guys feel like we have. 
Speaker B: So you putting your hand up for onboarding. Right, that's the term we're going to be using. Supply side, supply side onboarding. So that's Henry's Bus, Bicycle store or Bicycle tours. You're gonna have a WhatsApp based induction or onboarding. 
Speaker D: Yeah. 
Speaker B: Of the user. Yeah, but we're trying to use the WhatsApp look and feel because we won't. We probably won't get on WhatsApp. You know, so it's a PWA. But the look and feel of WhatsApp. Okay, yeah. 
Speaker C: Okay, that's fine. 
Speaker B: Maybe stick, no colors. So like a blue or something. Because it is. We've got to kind of push that. 
Speaker C: I like that. Okay, that's fine. But looking at the techno, I think let's keep it very basic since it's also going to have an impact on his design system. I think we go react, we can go vit rig. We don't really need SSR or step aside. Actually, yeah, we can use Next js. 
Speaker B: Right. 
Speaker C: Because I think we are going to need proper like organic marketing. That's just like. But for the poc, none of that is really going to matter. But we can just use Next js, keep it very simple. With an API, right, that we're going to be talking to. It can all be within next year. I mean you don't need to have like a dedicated repo for an API so you can all build it within one full stack framework. 
Speaker B: Yeah. 
Speaker C: What do you guys think? 
Speaker D: Especially that is a good idea. Yeah. 
Speaker C: So I think Next JS keep it super lightweight API folder. Same, same repo, have everything, our API rights within that. It has native support for pwa. So we can just build from that as well. 
Speaker A: Okay. Do you want to split up a text that only. 
Speaker B: So we must just have jobs to be done. So if you guys could just have your notebooks or something so we can just start divvying up the task. Because I think we're now getting to a point where it's allocation of tasks. Right. So let's just recite. Okay, so you're going to be doing the tech stack MD file for the Claude project. 
Speaker C: Yeah. 
Speaker B: Okay. I'm going to do the P. Should I do the prd? Yeah. Okay. So that's. I use the turn job to be done. So my JTBD is prd. Okay. And I'm gonna do the presentation. Right? Is that correct? Okay. Okay, cool. Okay. Any job to be done that you can recall, what's your. 
Speaker A: I think a supply and demand ownership. So okay, two platforms. 
Speaker B: Okay. 
Speaker A: I can work front end on both platforms. You build your tech on a branch like branch branch to the front end, push that back in, finish the build side, run that. So I can take on supply demand side. But maybe we have an owner on each of those sites because like supply, supply. 
Speaker B: You guys need to put up your hands here. Like. Yeah, it's not going to be come down to me Saying X, Y and Z. So what do you feel comfortable doing? You got to choose your. Choose your poison. I think you would be good at the front end. Like the. I mean the supply side, the demand side. Sorry. 
Speaker D: Oh, yes. 
Speaker C: Would you. 
Speaker B: Would you like it? Because. And then can you do the supply side or you guys work on that? 
Speaker A: You. 
Speaker B: It look sounds like you want to do the WhatsApp thing, so I was. 
Speaker C: Yeah, but I mean, if we're not gonna go. I mean, if you feel like it's a bit of a rabbit hole, I. I still think we can get WhatsApp board working. I can get. I can work on that. 
Speaker B: But try, try it. 
Speaker C: If you. 
Speaker B: If it's. If it's like have to authorize this, have to get this company document, don't do it. We're going to waste our time. 
Speaker A: So. 
Speaker D: So put a cap with. I would say time it. Yeah, I. Within an. An hour is a lot of time. But yeah, if within an hour or 30 minutes you decide. 
Speaker C: Yeah. 
Speaker D: Then it's just like. 
Speaker B: No, yeah, it's a waste of time. Just go straight into emulating. So what I would do is I 
Speaker C: Would scaffold the ribbon right. Next. Like basic, like. And then push it. Like push the branch and then you guys can just pull it from there and we can work from there. Then I will get started on just working on the WhatsApp. Marlon owns the. Yeah, the web supply. He owns the web Demand, demand. And then you're doing the design. 
Speaker B: All right, So I mean, use a back end backend. 
Speaker C: No, no, no. So the backend is within next J. 
Speaker D: Right. 
Speaker B: So yeah, but where are we storing. 
Speaker A: What are we going to use? 
Speaker B: Firebase Superbase? 
Speaker C: F. I'll just say spin up a. Do a docker container postgres. If you want to store data database just for postgres. Or if you want offline functionality, we could even use SQLite. 
Speaker B: Okay, let's do that. 
Speaker C: Yeah, just SQLite. 
Speaker B: Need to prioritize offline. So how does a user use it when they're in the deep end of Somalia? But you writing that down in the text? 
Speaker C: Yeah, I'll do the text. 
Speaker D: Yeah. 
Speaker C: Okay. Okay. So yeah, we just keep it simple. You can have Postgres for like Postgres and SQLite. So offline everything gets written to that SQLITE file. And then of course we've got network connectivity. Then we sync to the main. Main DB postgres. I think that keeps it quite simple like that. 
Speaker B: And then when you're on the timelines, we really want the. The kind of look and, and feel of saying to Brandon, optimistically. Optimistically, because I want to, to have the feel of trickle down. It's the key word here is when the trickle down impact is when money comes into a country and it gets to the guy creating the bicycles. It's that is they call the trickle down effect in economics. And so what I'm, what I'm getting at is that we're going to have this view of the itinerary going down. So you have your start date, your end date, and on that you have your different experiences plugged in. Right. And then when you click on it, it expands into the experience. That's my optimistic idea of how we have some can feel because we're selling with the eyes and we want the financial inclusion to be trickled down. So that's kind of the direction I would want. Sorry, I just have a clarify. We will probably do more of the integration because you're going to do the actual ui. 
Speaker A: Okay. 
Speaker B: But if he needs help, like can someone who's better with visuals or graphics help him out? Because he's going to be under the crush when it comes down to it. But let's see. AI.com. you know what I mean? So 
Speaker A: How do we want to do the first prototype for you? Because if Henry spins up the environments and the scaffold, I can go in with the initial. Cool. Let's wireframe this out. Yeah, this is what supply looks like. This is what demand looks like. We have the base flow set up so when you guys can come in and make it real. 
Speaker B: Yeah, yeah, yeah, exactly. So what's, what's going to happen with the hackathon, I can tell is that it's going to be like, okay, we need him to now do the tech stack. We're going to. There's going to be this waiting area. So what, how. And it's a challenge from a PM perspective. So how do you dodge these wait times? What can you work on in your own time to contribute? When everything is ready or aligned, then you're adding in your Lego blocks. Do you know what I mean? And that's what the challenge is not to like. Obviously we don't want to be working tonight. Now let's be real. So how do you work now when everyone's alive? We've got energy. How do you work on your components to add them in? 
Speaker D: Well, I'd say we utilize some sort of work tree methodology. In other words, have a work tree that was supposed to up a prototype of some of thoughts and then once you Pull with the latest. Whatever you say. Cool. Implement the prototype in actual real. 
Speaker B: Okay. Okay. All right. Is everyone happy with how we can start? 
Speaker D: Yeah. Also just some. So the between whoever's bivvy, whatever. Something like a branching strategy or something we just need to quickly just talk about are we going off of. Off of main and we just feature branch. 
Speaker B: Your name is a branch, it doesn't need to be your name. Just like you see that. 
Speaker D: That's why it's worth discussing because if I just use my name and I code the entire day on that feature, 
Speaker C: It's obviously not going to work. 
Speaker D: So you, you break. That's also where I think, I mean I'm getting the demand side. 
Speaker C: There's a load of work here. 
Speaker D: Like I'm going to probably break this up into 10, 10 cards but then you also need to know about those 10 cars. 
Speaker C: I think our, our techno usual project strategies. So we've got main. 
Speaker D: Yes. 
Speaker C: From Main you just branch off from the. Your branch will be like feature demand feature for slash. Demand is one feature, forward slash supply. And then from your feature what you can then do is that you just break out whatever small feature you're looking at. So if you're doing log, sorry experience card or whatever just branch off from that and then you to just push your code straight back into your feature. So if I pull your feature and give you a put in time I supposed to run it and see your feature and what you're doing running locally without breaking anything. 
Speaker D: Yes. 
Speaker C: And then only side just does the same thing feature and then he just wakes his commits, goes straight back into his branch. Right. And then once we are done we just consolidate those back into main and then we can run it just to simplify. 
Speaker D: Okay. 
Speaker C: I do have a quick client catch 
Speaker B: Up meeting at half past eleven on that. Are you guys happy to start? Okay. What time is it now? 
Speaker C: It's eight minutes to. Sorry, it's 22 past 11. Okay, I've got a quick catch up call with the client in about eight minutes. 
Speaker A: Okay. 
Speaker C: What I can do, what I would require from your side is can you just maybe speak about the product? Yes, yes, I want to. 
Speaker B: I'm going to smash that right now. I'm going to do the POD have a listening device. Yeah. 
Speaker C: Because what I need to scaffold my tech stack and I need, I'm going 
Speaker B: To do that right now. So while you're on the client call I'm going to, I'm going to do the prd. What can you guys do in the meantime is there something you can do? So, yeah, whatever the. Is that I can start setting up with the main information. Okay. And is everyone clear on the idea? So, like, do we all have a North Star that we. We're seeing? Because that's what's important. 
Speaker D: We don't. 
Speaker B: We don't have a distortion in what we're getting at. 
Speaker C: Does anyone have a traditional iPhone charger, 
Speaker B: Like an old one? 
Speaker D: So what I can do for you is I've recorded all of our chats and I can chuck all of it 
Speaker B: In the repo, actually see how clear it is. It's asked for an interpretation of it and the concept is still. 
Speaker D: But at least it's. It's helped. 
Speaker B: Yeah. 
Speaker D: So it's all really that I want us to. There you go. 
Speaker C: I'm going to stop this, give as much context to my clone and then that's basically going to highlight, like, what we need and that's going to. Yeah, then I'll. 
Speaker D: I didn't know until yesterday 
Speaker A: I was 
Speaker B: About to open my laptop. 
Speaker D: Can I stop? 
Speaker B: Go team. 