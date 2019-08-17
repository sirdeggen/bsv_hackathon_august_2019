import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomDark as SyntaxHighlighterTheme } from 'react-syntax-highlighter/dist/styles/prism';
import Page from '../../components/page'
import Layout from '../../components/layout'

export default class extends Page {
  render() {
    return (
      <Layout {...this.props} title="Layout and Styling">
        <h1 className="display-2">Styling</h1>
        <h2>Live Reloading</h2>
        <p>
          When running a Next.js project in development mode changes to JavaScript, HTML and CSS are live reloaded, meaning any changes to pages are applied immediately without a browser refresh.
        </p>
        <h2>SCSS and Webpack</h2>
        <p>
          The file <a href="https://github.com/iaincollins/nextjs-starter/blob/master/css/index.scss">index.scss</a> imports <a href="https://getbootstrap.com/">Bootstrap</a> and <a href="https://ionicframework.com/docs/ionicons/">Ionicons</a> and defines additional global CSS.
        </p>
        <p>
          This is loaded and added to the page in <a href="https://github.com/iaincollins/nextjs-starter/blob/master/components/layout.js">components/layout.js</a>.
        </p>
        <SyntaxHighlighter style={SyntaxHighlighterTheme} language={"javascript"}>
{`import Styles from '../css/index.scss'

...

  render() {
    return (
      <Head>
        <style dangerouslySetInnerHTML={{__html: Styles}}/>
      </Head>
      )
  }
`}
        </SyntaxHighlighter>
        <p>
          Being able to import SCSS/CSS like this is made possible with webpack
          configuration in <a href="https://github.com/iaincollins/nextjs-starter/blob/master/next.config.js">next.config.js</a>.
        </p>
        <SyntaxHighlighter style={SyntaxHighlighterTheme} language={"javascript"}>
{`config.module.rules.push(
{
  test: /\.(css|scss)/,
  loader: 'emit-file-loader',
  options: {
    name: 'dist/[path][name].[ext]'
  }
},
{
  test: /\.css$/,
  loader: 'babel-loader!raw-loader'
},
{
  test: /\.scss$/,
  loader: 'babel-loader!raw-loader!sass-loader'
}
)`}
        </SyntaxHighlighter>
        <h2>Inline Styling</h2>
        <p>
          Inline styles are styles applied directly to an element. They can reference JavaScript variables.
        </p>
        <SyntaxHighlighter style={SyntaxHighlighterTheme} language={"jsx"}>
{`<p style={{border: '2px solid blue', padding: 5, fontSize: '1em'}}>
  Example of an inline style.
</p>`}
        </SyntaxHighlighter>
        <p style={{border: '2px solid blue', padding: 5, fontSize: '1em'}}>
          Example of an inline style.
        </p>
        <h2>Scoped CSS</h2>
        <p>
          Styles defined with JSX in a component only impact elements that in the component in which the styles are defined, meaning any CSS/SCSS rules will not impact how other components on the same page appear.
        </p>
        <p>
          They can also reference JavaScript variables.
        </p>
        <style jsx>{`
          .component-scoped-css {
            border: 2px solid red;
            padding: 5px;
          }
        `}</style>
        <SyntaxHighlighter style={SyntaxHighlighterTheme} language={"jsx"}>
{`<style jsx>{\`
  .component-scoped-css {
    border: 2px solid red;
    padding: 5px;
  }
\`}</style>`}
        </SyntaxHighlighter>
        <p className="component-scoped-css">
          Example of scoped CSS
        </p>
        <h2>Global CSS</h2>
        <p>
          Use the 'global' option to have CSS defined with JSX apply outside of the scope of the component where it is declared.
          This will impact all elements on the current page.
        </p>
        <SyntaxHighlighter style={SyntaxHighlighterTheme} language={"jsx"}>
{`<style jsx global>{\`
  div {
    border: 2px solid blue;
  }
\`}</style>`}
        </SyntaxHighlighter>
        <h2>Fonts</h2>
        <p>
          The <a href="https://ionicframework.com/docs/ionicons/">Ionicon</a> icon font assets are served directly from NPM using a custom route defined in Express.
        </p>
        <SyntaxHighlighter style={SyntaxHighlighterTheme} language={"javascript"}>
{`expressApp.use('/fonts/ionicons', express.static('./node_modules/ionicons/dist/fonts'))`}
        </SyntaxHighlighter>
        <p>
          Note: This is a simple way to include assets like fonts, but you should take care when
          using this approach, as it serves content from your site directly
          from an NPM module. You should not use this approach with modules
          you don't trust.
        </p>
        <p>
          Alternatively, you also import assets into your project by copying them into the <a href="/static/example.html">/static</a> directory and serving them from there.
        </p>
     </Layout>
    )
  }
}
