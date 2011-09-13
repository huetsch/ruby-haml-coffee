compile = (function() {
  var modules = {};

  // helper.js
  (function() {
    modules["helper.js"] = {
      whitespace: function(n) {
        var a;
        n = n * 2;
        a = [];
        while (a.length < n) {
          a.push(' ');
        }
        return a.join('');
      },
      escape: function(s) {
        return s.replace(/"/g, '\\"');
      }
    };
  }).call(this);

  // nodes/node.js
  (function() {
    var Node, e, w;
    e = modules["helper.js"].escape;
    w = modules["helper.js"].whitespace;
    modules["nodes/node.js"] = Node = (function() {
      function Node(expression, block_level, code_block_level) {
        this.expression = expression;
        this.block_level = block_level;
        this.code_block_level = code_block_level;
        this.children = [];
        this.opener = this.closer = "";
        this.cw = w(this.code_block_level);
        this.hw = w(this.block_level - this.code_block_level);
      }
      Node.prototype.addChild = function(child) {
        this.children.push(child);
        return this;
      };
      Node.prototype.getOpener = function() {
        this.evaluateIfNecessary();
        return this.opener;
      };
      Node.prototype.getCloser = function() {
        this.evaluateIfNecessary();
        return this.closer;
      };
      Node.prototype.evaluateIfNecessary = function() {
        if (!this.evaluated) {
          this.evaluate();
        }
        return this.evaluated = true;
      };
      Node.prototype.evaluate = function() {};
      Node.prototype.render = function() {
        var child, output, _i, _len, _ref;
        output = "" + (this.getOpener()) + "\n";
        _ref = this.children;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          output += "" + (child.render());
        }
        if (this.getCloser().length > 0) {
          output += "" + (this.getCloser()) + "\n";
        }
        return output;
      };
      return Node;
    })();
  }).call(this);

  // nodes/text.js
  (function() {
    var Node, Text, e;
    var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
      for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
      function ctor() { this.constructor = child; }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor;
      child.__super__ = parent.prototype;
      return child;
    };
    Node = modules["nodes/node.js"];
    e = modules["helper.js"].escape;
    modules["nodes/text.js"] = Text = (function() {
      function Text() {
        Text.__super__.constructor.apply(this, arguments);
      }
      __extends(Text, Node);
      Text.prototype.evaluate = function() {
        return this.opener = "" + this.cw + "o.push \"" + this.hw + this.expression + "\"";
      };
      return Text;
    })();
  }).call(this);

  // nodes/haml.js
  (function() {
    var Haml, Node, e;
    var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
      for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
      function ctor() { this.constructor = child; }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor;
      child.__super__ = parent.prototype;
      return child;
    };
    Node = modules["nodes/node.js"];
    e = modules["helper.js"].escape;
    modules["nodes/haml.js"] = Haml = (function() {
      function Haml() {
        Haml.__super__.constructor.apply(this, arguments);
      }
      __extends(Haml, Node);
      Haml.selfCloseTags = ["meta", "img", "link", "br", "hr", "input", "area", "base"];
      Haml.prototype.evaluate = function() {
        var htmlTagPrefix, parsedExpression;
        parsedExpression = this.parseExpression(this.expression);
        htmlTagPrefix = this.buildHtmlTag(parsedExpression);
        if (this.isSelfClosing(parsedExpression.tag)) {
          this.opener = "" + this.cw + "o.push \"" + this.hw + (e(htmlTagPrefix)) + ">";
          this.closer = "" + this.cw + "o.push \"" + this.hw + "</" + parsedExpression.tag + ">\"";
        } else {
          this.opener = "" + this.cw + "o.push \"" + this.hw + (e(htmlTagPrefix)) + " />";
        }
        if (parsedExpression.assignment) {
          this.opener += '#{' + parsedExpression.assignment + '}';
        }
        return this.opener += '"';
      };
      Haml.prototype.parseExpression = function(exp) {
        var optionProperties, tagProperties;
        tagProperties = this.parseTag(exp);
        optionProperties = this.parseOptions(exp);
        return {
          tag: tagProperties.tag,
          ids: tagProperties.ids,
          classes: tagProperties.classes,
          pairs: optionProperties.pairs,
          assignment: optionProperties.assignment
        };
      };
      Haml.prototype.buildHtmlTag = function(parsedExpression) {
        var pair, tagParts, _i, _len, _ref;
        tagParts = ["<" + parsedExpression.tag];
        if (parsedExpression.ids) {
          tagParts.push("id=\"" + (parsedExpression.ids.join(' ')) + "\"");
        }
        if (parsedExpression.classes) {
          tagParts.push("class=\"" + (parsedExpression.classes.join(' ')) + "\"");
        }
        if (parsedExpression.pairs.length > 0) {
          _ref = parsedExpression.pairs;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            pair = _ref[_i];
            tagParts.push("" + pair.key + "=" + pair.value);
          }
        }
        return tagParts.join(' ');
      };
      Haml.prototype.parseTag = function(exp) {
        var classes, id, ids, klass, tag, tagExp;
        try {
          tagExp = exp.match(/^((?:[.#%][a-z_\-][a-z0-9_:\-]*)+)(.*)$/i)[1];
          tag = tagExp.match(/\%([a-z_\-][a-z0-9_:\-]*)/i);
          tag = tag ? tag[1] : 'div';
          ids = tagExp.match(/\#([a-z_\-][a-z0-9_\-]*)/gi);
          classes = tagExp.match(/\.([a-z_\-][a-z0-9_\-]*)/gi);
          return {
            tag: tag,
            ids: ids ? (function() {
              var _i, _len, _results;
              _results = [];
              for (_i = 0, _len = ids.length; _i < _len; _i++) {
                id = ids[_i];
                _results.push(id.substr(1));
              }
              return _results;
            })() : void 0,
            classes: classes ? (function() {
              var _i, _len, _results;
              _results = [];
              for (_i = 0, _len = classes.length; _i < _len; _i++) {
                klass = classes[_i];
                _results.push(klass.substr(1));
              }
              return _results;
            })() : void 0
          };
        } catch (error) {
          throw "Unable to parse tag from " + exp + ": " + error;
        }
      };
      Haml.prototype.parseOptions = function(exp) {
        var assignment, attributesExp, optionsExp, pairs;
        optionsExp = exp.match(/[\{\s=].*/i);
        if (optionsExp) {
          optionsExp = optionsExp[0];
          if (optionsExp[0] === "{") {
            attributesExp = optionsExp.match(/\{(.*)\}/);
            if (attributesExp) {
              attributesExp = attributesExp[1];
            }
            assignment = optionsExp.match(/\{.*\}\s*=\s*(.*)/);
          } else {
            assignment = optionsExp.match(/\.*=\s*(.*)/);
          }
          if (assignment) {
            assignment = assignment[1];
          }
          pairs = this.parseAttributes(attributesExp);
        }
        return {
          assignment: assignment,
          pairs: pairs || []
        };
      };
      Haml.prototype.parseAttributes = function(attributesExp) {
        var attribute, attributes, key, pair, pairs, result, value, valueIsLiteral, _i, _len;
        pairs = [];
        if (attributesExp == null) {
          return pairs;
        }
        attributes = attributesExp.match(/(:[^\s|=]+\s*=>\s*(("[^"]+")|('[^']+')|[^\s]+))/g);
        for (_i = 0, _len = attributes.length; _i < _len; _i++) {
          attribute = attributes[_i];
          pair = attribute.split('=>');
          key = pair[0].trim().substr(1);
          result = key.match(/^'(.+)'$/);
          if (result) {
            key = result[1];
          }
          value = pair[1].trim();
          valueIsLiteral = value.match(/("|')/);
          pairs.push({
            key: key,
            value: valueIsLiteral ? value : '"#{' + value + '}"'
          });
        }
        return pairs;
      };
      Haml.prototype.isSelfClosing = function(tag) {
        return Haml.selfCloseTags.indexOf(tag) === -1;
      };
      return Haml;
    })();
  }).call(this);

  // nodes/code.js
  (function() {
    var Code, Node, e;
    var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
      for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
      function ctor() { this.constructor = child; }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor;
      child.__super__ = parent.prototype;
      return child;
    };
    Node = modules["nodes/node.js"];
    e = modules["helper.js"].escape;
    modules["nodes/code.js"] = Code = (function() {
      function Code() {
        Code.__super__.constructor.apply(this, arguments);
      }
      __extends(Code, Node);
      Code.prototype.evaluate = function() {
        var code, expression, identifier, _ref;
        _ref = this.expression.match(/(-|=)\s(.*)/), expression = _ref[0], identifier = _ref[1], code = _ref[2];
        return this.opener = identifier === '-' ? "" + this.cw + code : "" + this.cw + "o.push \"" + this.hw + "\#{" + code + "}\"";
      };
      return Code;
    })();
  }).call(this);

  // compiler.js
  (function() {
    var Code, Compiler, Haml, Node, Text;
    var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
    Node = modules["nodes/node.js"];
    Text = modules["nodes/text.js"];
    Haml = modules["nodes/haml.js"];
    Code = modules["nodes/code.js"];
    modules["compiler.js"] = Compiler = (function() {
      function Compiler() {}
      Compiler.prototype.node_factory = function(expression, current_block_level, current_code_block_level) {
        var node;
        if (expression.match(/^(-|=)\s*(.*)/)) {
          node = new Code(expression, current_block_level, current_code_block_level);
        } else if (expression.match(/^(%|#|\.)(.*)/)) {
          node = new Haml(expression, current_block_level, current_code_block_level);
        } else {
          node = new Text(expression, current_block_level, current_code_block_level);
        }
        return node;
      };
      Compiler.prototype.update_code_block_level = function(node) {
        if (node instanceof Code) {
          return this.current_code_block_level = node.code_block_level + 1;
        } else {
          return this.current_code_block_level = node.code_block_level;
        }
      };
      Compiler.prototype.indent_changed = function() {
        return this.current_indent !== this.previous_indent;
      };
      Compiler.prototype.is_indent = function() {
        return this.current_indent > this.previous_indent;
      };
      Compiler.prototype.update_tab_size = function() {
        if (this.tab_size === 0) {
          return this.tab_size = this.current_indent - this.previous_indent;
        }
      };
      Compiler.prototype.update_block_level = function() {
        this.current_block_level = this.current_indent / this.tab_size;
        if (this.current_block_level - Math.floor(this.current_block_level) > 0) {
          throw "Indentation error in line " + this.line_number;
        }
        if ((this.current_indent - this.previous_indent) / this.tab_size > 1) {
          throw "Block level too deep in line " + this.line_number;
        }
        return this.delta = this.previous_block_level - this.current_block_level;
      };
      Compiler.prototype.push_parent = function() {
        this.stack.push(this.parent_node);
        return this.parent_node = this.node;
      };
      Compiler.prototype.pop_parent = function() {
        var i, _ref, _results;
        _results = [];
        for (i = 0, _ref = this.delta - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
          _results.push(this.parent_node = this.stack.pop());
        }
        return _results;
      };
      Compiler.prototype.parse = function(source) {
        this.line_number = 0;
        this.previous_indent = 0;
        this.tab_size = 0;
        this.current_block_level = this.previous_block_level = 0;
        this.current_code_block_level = this.previous_code_block_level = 2;
        this.root = this.parent_node = new Node("", this.current_block_level, this.current_code_block_level);
        this.node = null;
        this.stack = [];
        return source.split("\n").forEach(__bind(function(line) {
          var expression, result, whitespace;
          result = line.match(/^(\s*)(.*)/);
          whitespace = result[1];
          expression = result[2];
          if (expression.length > 0) {
            if (!expression.match(/^\//)) {
              this.current_indent = whitespace.length;
              if (this.indent_changed()) {
                this.update_tab_size();
                this.update_block_level();
                if (this.is_indent()) {
                  this.push_parent();
                } else {
                  this.pop_parent();
                }
                this.update_code_block_level(this.parent_node);
              }
              this.node = this.node_factory(expression, this.current_block_level, this.current_code_block_level);
              this.parent_node.addChild(this.node);
              this.previous_block_level = this.current_block_level;
              this.previous_indent = this.current_indent;
              this.line_number++;
            }
          }
        }, this));
      };
      Compiler.prototype.parameterize = function(s) {
        s = s.replace(/(\s|-)+/g, "_");
        return s;
      };
      Compiler.prototype.render = function(filename, namespace) {
        var name, output, segment, segments, _i, _len;
              if (namespace != null) {
          namespace;
        } else {
          namespace = "HAML";
        };
        output = "window." + namespace + " ?= {}\n";
        segments = this.parameterize(filename).split('/');
        name = segments.pop();
        for (_i = 0, _len = segments.length; _i < _len; _i++) {
          segment = segments[_i];
          namespace += "." + segment;
          output += "window." + namespace + " ?= {}\n";
        }
        output += "window." + namespace + "." + name + " = (context) ->\n";
        output += "  fn = (context) ->\n";
        output += "    o = []";
        output += this.root.render();
        output += "    return o.join(\"\\n\")\n";
        output += "  return fn.call(context)\n";
        return output;
      };
      return Compiler;
    })();
  }).call(this);

  var Compiler = modules["compiler.js"];
  return function(namespace, filename, source) {
    var c = new Compiler(c);
    c.parse(source);
    return c.render(filename, namespace);
  }
}).call(this);
