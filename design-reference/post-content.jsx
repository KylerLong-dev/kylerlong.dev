/* global React, CodeBlock, Callout, Figure, Tweet, FN */

/* ============================================
   Sample post content
   Topic: rewriting markdown pipeline / app router notes
   ============================================ */

function PostContent() {
  return (
    <article className="prose">
      <p>
        I've rewritten my markdown pipeline three times in the last eighteen months,
        and each time I told myself it would be the last. This week I did it again
        — and this time, with some confidence that the choice will hold.
        These are the notes I took along the way, mostly so I can find them again
        the next time the temptation strikes.<FN n={1} />
      </p>

      <p>
        For context: this site is a Next.js App Router project. Posts are MDX files
        living next to the route segments that render them. Nothing exotic — but the
        intersection of <a href="#">React Server Components</a>, dynamic imports,
        and syntax highlighting is a swamp, and I keep stepping into it.
      </p>

      <h2 id="the-old-setup">The old setup</h2>
      <p>
        Until last weekend I was using <a href="#"><code>next-mdx-remote</code></a>{' '}
        with a small <code>rehype</code> chain. It worked, mostly. But every time I
        added a new MDX component I had to thread it through three different
        boundaries, and the highlighter was bundling a 600KB chunk into every
        client component that happened to live near a post.
      </p>

      <CodeBlock
        filename="app/journal/[slug]/page.tsx"
        lang="tsx"
        lines={[
          '[[com:// the old, painful version]]',
          '[[key:import]] { [[var:MDXRemote]] } [[key:from]] [[str:\'next-mdx-remote/rsc\']];',
          '[[key:import]] { [[var:bundleMDX]] } [[key:from]] [[str:\'mdx-bundler\']];',
          '[[key:import]] * [[key:as]] [[var:runtime]] [[key:from]] [[str:\'react/jsx-runtime\']];',
          '',
          '[[key:export]] [[key:async]] [[key:function]] [[fn:Page]]({ [[var:params]] }: { [[var:params]]: { [[var:slug]]: [[type:string]] } }) {',
          '  [[key:const]] [[var:source]] = [[key:await]] [[fn:readPost]]([[var:params]].[[var:slug]]);',
          '  [[key:const]] { [[var:code]] } = [[key:await]] [[fn:bundleMDX]]({ [[var:source]] });',
          '  [[key:return]] <[[tag:MDXRemote]] [[var:source]]={[[var:source]]} [[var:components]]={[[var:mdx]]} />;',
          '}',
        ]}
        highlight={[3, 4]}
      />

      <Callout type="note" title="On the highlighter">
        <p>
          The 600KB chunk came from <code>shiki</code> being imported eagerly. The
          fix is well-known — lazy it on the server — but I hadn't done it because
          I'd convinced myself it didn't matter. It did.
        </p>
      </Callout>

      <h2 id="what-i-changed">What I changed</h2>
      <p>
        The new pipeline does three things differently. First, MDX is compiled at
        build time via a small script, not at request time. Second, the highlighter
        runs once during that build, produces tokenized HTML, and the runtime never
        loads shiki at all. Third — and this is the change I'm most pleased about —
        every MDX component is a regular React component imported from one file.
        No registry, no map, no boundary gymnastics.
      </p>

      <CodeBlock
        filename="scripts/build-posts.ts"
        lang="ts"
        lines={[
          '[[key:import]] { [[var:compile]] } [[key:from]] [[str:\'@mdx-js/mdx\']];',
          '[[key:import]] { [[var:getHighlighter]] } [[key:from]] [[str:\'shiki\']];',
          '[[key:import]] { [[var:rehypeShiki]] } [[key:from]] [[str:\'./rehype-shiki\']];',
          '',
          '[[key:const]] [[var:highlighter]] = [[key:await]] [[fn:getHighlighter]]({',
          '  [[var:themes]]: [[op:[]][[str:\'github-dark\'], [[str:\'github-light\']][[op:]]],',
          '  [[var:langs]]: [[op:[]][[str:\'ts\'], [[str:\'tsx\'], [[str:\'bash\']][[op:]]],',
          '});',
          '',
          '[[key:export]] [[key:async]] [[key:function]] [[fn:buildPost]]([[var:slug]]: [[type:string]]) {',
          '  [[key:const]] [[var:raw]] = [[key:await]] [[fn:readFile]]([[fn:postPath]]([[var:slug]]));',
          '  [[key:return]] [[fn:compile]]([[var:raw]], { [[var:rehypePlugins]]: [[op:[]][[fn:rehypeShiki]]([[var:highlighter]])[[op:]] });',
          '}',
        ]}
      />

      <p>
        The build runs in about 800ms for 40 posts on my laptop. That's fast enough
        that I run it on every save in dev, gated behind a watcher. The cost of
        being wrong is the next 30 minutes of my life, and 800ms is well inside the
        margin where I won't notice.
      </p>

      <blockquote>
        <p>
          The best build-time work is the work you can stop doing at runtime
          without anyone noticing.
        </p>
        <cite>something I told myself, in a notebook, in October</cite>
      </blockquote>

      <h2 id="a-hiccup-with-shiki">A hiccup with shiki</h2>
      <p>
        The first attempt blew up because <code>shiki</code> v1.0 changed the
        import shape — what used to be a default export is now a named one, and
        the WASM grammar loader needs a base URL when run outside the browser.
        I lost an embarrassing amount of time to this before noticing the migration
        guide.
      </p>

      <Callout type="warn" title="Heads up if you're upgrading">
        <p>
          <code>getHighlighter</code> is deprecated in favor of{' '}
          <code>createHighlighter</code>. The old name still works but logs a
          warning into your build output, which Vercel turns red, which makes you
          think the deploy failed. Just rename it.
        </p>
      </Callout>

      <Figure caption="Build output, after — one slow line is the highlighter warming up.">
        <BuildOutput />
      </Figure>

      <h3 id="caching-the-highlighter">Caching the highlighter</h3>
      <p>
        Booting a fresh highlighter per post is wasteful. The fix is a module-level
        singleton — but be careful: in Next.js dev mode, the build module is
        re-evaluated more often than you'd expect, and a true singleton needs to be
        hung off <code>globalThis</code> if you want it to survive HMR.
      </p>

      <Tweet name="Lee Robinson" handle="leeerob" date="May 14, 2026">
        <p>
          A reminder: in the App Router, “runs once” depends on which module graph
          you're in. Server components, route handlers, and edge functions all
          have different lifetimes. If you cache something, pick where it lives
          on purpose.
        </p>
      </Tweet>

      <h2 id="whats-left">What's left to do</h2>
      <p>
        Three things I haven't fixed yet and want to come back to:
      </p>

      <ul>
        <li>
          Footnote backlinks render but don't smooth-scroll on Safari{' '}
          <FN n={2} /> — I think this is a <code>scroll-padding-top</code> issue
          but I haven't proved it.
        </li>
        <li>
          Inline <code>{`<Tweet>`}</code> embeds are static placeholders. I want
          them to be real, but not at the cost of loading the Twitter widget on
          every page.
        </li>
        <li>
          The RSS feed still uses the old pipeline. Migrating that means choosing
          between rendering MDX twice or shipping HTML I don't fully control.
          Both options have something wrong with them.
        </li>
      </ul>

      <h2 id="signing-off">Signing off</h2>
      <p>
        I'm writing this in the same editor I built the pipeline in, which feels
        right — the whole project, including this post, gets a little simpler
        every time I touch it. That's the goal. If the next rewrite is the last
        one, it'll be because there's nothing left to take away.
      </p>
      <p>
        — Kyler
      </p>

      <section className="footnotes">
        <h3>Footnotes</h3>
        <ol>
          <li id="fn-1">
            The previous two attempts are written up{' '}
            <a href="#">here</a> and <a href="#">here</a>, if you're curious about
            the dead ends. <a href="#fn-ref-1" className="footnote-backref">↩</a>
          </li>
          <li id="fn-2">
            Reproducible on Safari 17.4 but not on Technology Preview, so it may
            already be fixed upstream. <a href="#fn-ref-2" className="footnote-backref">↩</a>
          </li>
        </ol>
      </section>
    </article>
  );
}

/* A static, illustrative "build output" panel for the figure */
function BuildOutput() {
  const lines = [
    { t: '$', body: 'pnpm build:posts', mute: false },
    { t: ' ', body: '', mute: true },
    { t: '✓', body: 'compiled 40 posts', mute: false, accent: true },
    { t: '·', body: 'shiki warming up……………………………………………… 412ms', mute: true },
    { t: '·', body: 'mdx compile ………………………………………………………… 287ms', mute: true },
    { t: '·', body: 'write artifacts …………………………………………………… 96ms', mute: true },
    { t: ' ', body: '', mute: true },
    { t: '✓', body: 'done in 795ms', mute: false, accent: true },
  ];
  return (
    <div style={{
      width: '100%', height: '100%', padding: '24px 32px',
      fontFamily: 'var(--font-mono)', fontSize: 13, textAlign: 'left',
      display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4,
    }}>
      {lines.map((l, i) => (
        <div key={i} style={{ display: 'flex', gap: 12, color: l.mute ? 'var(--text-3)' : 'var(--text)' }}>
          <span style={{ color: l.accent ? 'var(--accent)' : (l.t === '$' ? 'var(--accent)' : 'var(--text-3)'), width: 12 }}>{l.t}</span>
          <span>{l.body}</span>
        </div>
      ))}
    </div>
  );
}

window.PostContent = PostContent;
