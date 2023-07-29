import{_ as s,o as a,c as n,U as e}from"./chunks/framework.17475148.js";const _=JSON.parse('{"title":"单例模式","description":"","frontmatter":{},"headers":[],"relativePath":"guide/single.md","filePath":"guide/single.md","lastUpdated":1690186143000}'),l={name:"guide/single.md"},o=e(`<h1 id="单例模式" tabindex="-1">单例模式 <a class="header-anchor" href="#单例模式" aria-label="Permalink to &quot;单例模式&quot;">​</a></h1><p><code>Eagle</code>是单例模式的类，多次实例化的对象是一致的，并不会创建新的对象，这样 做的目的是为了防止多次实例化，导致对错误，性能数据的重复处理。</p><p>下面的例子说明了这种情况：</p><div class="language-javascript line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">javascript</span><pre class="shiki material-theme-palenight"><code><span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> instance1 </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">Eagle</span><span style="color:#A6ACCD;">()</span></span>
<span class="line"><span style="color:#C792EA;">const</span><span style="color:#A6ACCD;"> instance2 </span><span style="color:#89DDFF;">=</span><span style="color:#A6ACCD;"> </span><span style="color:#89DDFF;">new</span><span style="color:#A6ACCD;"> </span><span style="color:#82AAFF;">Eagle</span><span style="color:#A6ACCD;">()</span></span>
<span class="line"><span style="color:#A6ACCD;">console</span><span style="color:#89DDFF;">.</span><span style="color:#82AAFF;">log</span><span style="color:#A6ACCD;">(instance1 </span><span style="color:#89DDFF;">===</span><span style="color:#A6ACCD;"> instance2)  </span><span style="color:#676E95;font-style:italic;">// true</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br></div></div><p>打印的结果为true说明是同一个对象。</p><div class="warning custom-block"><p class="custom-block-title">WARNING</p><p>值得注意的是，多次实例化虽然不会产生不同的对象，但是如果传入了配置项，会发生配置覆盖合并的情况。</p></div><div class="tip custom-block"><p class="custom-block-title">TIP</p><p>如果你是Vue用户，则不必关注上述情况，因为Vue不允许重复安装同一个插件。</p></div>`,7),p=[o];function t(c,r,i,d,A,C){return a(),n("div",null,p)}const y=s(l,[["render",t]]);export{_ as __pageData,y as default};