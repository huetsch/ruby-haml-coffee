require 'haml-coffee'

describe HamlCoffee do
  it 'generates a template using haml-coffee.js' do
    source = "%div{ :class => 'test' }\n" +
             "  - if @which == 'first'\n" +
             "    Hello!\n" +
             "  - else\n" +
             "    Good-bye!"

    result = "<div class='test'>\n" +
             "$text\n" +
             "</div>"
    
    compiled = HamlCoffee.compile(source, :namespace => 'Testing', :filename => 'template')
    compiled = "window = {};\n#{compiled}"

    context = ExecJS.compile(compiled)

    context.call('window.Testing.template', :which => 'first').should == result.sub('$text', 'Hello!')
    context.call('window.Testing.template', :which => 'second').should == result.sub('$text', 'Good-bye!')
  end

  it 'properly handles a user defined function using haml-coffee.js' do
    source = "- foo = (x) ->\n" +
             "  #yes\n" + 
             "  = x\n" + 
             "= foo(10)"
    result = "<div id=\"yes\">\n" + 
             "</div>\n" + 
             "10\n"

    compiled = HamlCoffee.compile(source, :namespace => 'Testing', :filename => 'template')
    compiled = "window = {};\n#{compiled}"

    context = ExecJS.compile(compiled)

    context.call('window.Testing.template', :which => 'first').should == result
  end
end
