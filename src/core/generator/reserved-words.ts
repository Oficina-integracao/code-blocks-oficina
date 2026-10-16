/** C++ keywords and Arduino names that must not be emitted as variable identifiers. */
export const ARDUINO_RESERVED_WORDS = [
  "setup,loop,if,else,for,switch,case,while,do,break,continue,return,goto",
  "define,include,HIGH,LOW,INPUT,OUTPUT,INPUT_PULLUP,true,false,null",
  "int,float,double,char,byte,bool,boolean,void,long,short,String",
  "alignas,alignof,and,and_eq,asm,auto,bitand,bitor,char8_t,char16_t,char32_t,class,compl",
  "concept,const,consteval,constexpr,constinit,const_cast,co_await,co_return,co_yield,decltype",
  "default,delete,dynamic_cast,enum,explicit,export,extern,friend,inline,mutable,namespace,new",
  "noexcept,not,not_eq,nullptr,operator,or,or_eq,private,protected,public,register,reinterpret_cast",
  "requires,signed,sizeof,static,static_assert,static_cast,struct,template,this,thread_local,throw",
  "try,typedef,typeid,typename,union,unsigned,using,virtual,volatile,wchar_t,xor,xor_eq",
].join(",");
