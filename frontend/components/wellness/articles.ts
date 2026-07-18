export interface Article {
  slug: string;
  title: string;
  summary: string;
  content: string[];
}

export const ARTICLES: Article[] = [
  {
    slug: "grounding-techniques",
    title: "Grounding Techniques for Anxious Moments",
    summary:
      "A few simple ways to bring yourself back to the present when anxiety takes over.",
    content: [
      "When anxiety spikes, your mind often races ahead — to what might go wrong, what you should have said, what happens next. Grounding techniques work by pulling your attention back to right now, to your actual body in this actual room, which is usually a safer place than wherever your thoughts have gone.",
      "One simple method is the 5-4-3-2-1 technique: name five things you can see, four things you can touch, three things you can hear, two things you can smell, and one thing you can taste. It sounds almost too simple to work, but the act of searching for specific details gives your mind something concrete to do instead of spiraling.",
      "Another option is to press your feet firmly into the floor and notice the sensation — the pressure, the temperature, the texture beneath you. Physical sensation is hard to argue with; it's happening now, not in an imagined future.",
      "Grounding won't make the underlying worry disappear, and it isn't meant to. What it does is create a little space — enough to breathe, think a bit more clearly, and decide what you actually need next. If anxiety is showing up often or feels difficult to manage on your own, a therapist can help you build a fuller toolkit suited to you specifically.",
    ],
  },
  {
    slug: "better-sleep",
    title: "Better Sleep, One Small Step at a Time",
    summary:
      "Sleep struggles rarely fix themselves overnight — small, consistent changes tend to help more than big ones.",
    content: [
      "Poor sleep and low mood often feed each other. It's hard to sleep when your mind is busy, and it's hard to feel steady when you're exhausted. If you're in that cycle, know that it's common, and that small changes tend to move the needle more reliably than a single dramatic fix.",
      "A consistent wake-up time — even on days you slept badly — helps your body's internal clock more than a consistent bedtime does. It feels counterintuitive to get up on schedule after a rough night, but it's one of the more effective levers available to you.",
      "Screens before bed are talked about a lot, and for good reason, but the bigger issue for many people is what's on the screen — a heated conversation, doom-scrolling news, work email — more than the light itself. If you use your phone before bed, notice whether the content is winding you up rather than down.",
      "If your mind tends to get busy right as you lie down, keeping a small notepad by the bed to jot down tomorrow's worries can help — you're not solving anything at 11pm, just setting it down so your mind doesn't have to hold it alone. If sleep difficulty persists for weeks or is affecting your daily life significantly, it's worth talking to a doctor — some sleep issues have physical causes worth ruling out.",
    ],
  },
  {
    slug: "naming-feelings",
    title: "What to Do When You Don't Know What You're Feeling",
    summary:
      "Sometimes the hardest part isn't the feeling itself — it's not being able to name it.",
    content: [
      "Not every difficult moment comes with a clear label. Sometimes you just feel 'off,' or heavy, or restless in a way you can't quite pin down. That's not a failure of self-awareness — emotions are often layered, and it's normal for it to take some time to sort out what's actually going on.",
      "One approach is to stop trying to name the single 'right' feeling and instead ask a few smaller questions: is this closer to sadness or to frustration? Does it feel more like tiredness or like dread? You don't need a perfect answer — narrowing it down even a little often loosens the knot.",
      "It can also help to separate the feeling from the story your mind is telling about it. 'I feel anxious' is different from 'I feel anxious because I'm clearly failing at everything' — the second sentence has quietly added a judgment on top of the feeling. Noticing that layer doesn't make the feeling go away, but it stops the feeling from snowballing into something bigger.",
      "Writing can help here too — even a few unstructured lines about what's going on in your body and your day, without trying to make it tidy. You don't have to figure it all out alone; if this becomes a frequent, heavy experience, a therapist can help you build language for what you're carrying.",
    ],
  },
  {
    slug: "chronic-illness-coping",
    title: "Living Well Alongside a Chronic Illness",
    summary:
      "Chronic illness affects more than the body — the emotional weight is real, and worth acknowledging.",
    content: [
      "Living with a chronic illness means managing a body that doesn't always cooperate with your plans, alongside the emotional weight of uncertainty, fatigue, and sometimes grief for the life you expected to have. That emotional side is just as real as the physical symptoms, even though it's talked about far less.",
      "It's common to feel like you have to perform wellness for the people around you — to say 'I'm fine' more often than it's true, because explaining the full picture feels exhausting. Give yourself permission to not do that in every space. You don't owe everyone the full story, but finding at least one place — a person, a journal, a community — where you can be honest about how hard it actually is can matter enormously.",
      "Pacing is often more sustainable than pushing through. On better days, it can be tempting to catch up on everything you couldn't do before — but overextending on a good day is one of the more common ways to trigger a harder one afterward. Steady and moderate usually serves you better than a boom-and-bust pattern.",
      "You're allowed to grieve the parts of life that chronic illness has changed, while also building a genuinely good life within your actual circumstances — the two aren't in conflict. Connecting with others who understand the specific experience of chronic illness, whether through community, a support group, or a therapist familiar with chronic health conditions, can make a real difference.",
    ],
  },
  {
    slug: "coping-with-grief",
    title: "Gentle Ways to Cope with Grief",
    summary:
      "Grief doesn't move in a straight line, and there's no schedule you're supposed to be keeping.",
    content: [
      "Grief has a way of showing up unpredictably — steady for a while, then suddenly overwhelming over something small, like a smell or a song. That unpredictability is normal. Grief was never a straight line, whatever the neat five-stage version you may have heard suggests.",
      "There's no correct timeline for grief, and no point at which you're supposed to be 'over it.' What tends to change over time isn't that the loss stops mattering, but that you slowly build a life that can hold it alongside everything else. Some days that feels possible. Other days it doesn't, and that's not a setback — it's just grief being grief.",
      "It can help to let go of the idea that you need to feel a certain way to be doing grief 'right.' Anger, relief, guilt, numbness, and deep sadness can all show up, sometimes in the same afternoon, and none of them mean you're grieving wrong.",
      "If you have people who let you talk about what you lost — not just in the first weeks, but months later too — that matters more than most people realize. If grief feels stuck, or is affecting your ability to function in daily life for an extended period, a grief-informed therapist can offer support that's hard to fully get elsewhere.",
    ],
  },
];