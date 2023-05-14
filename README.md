# Gum

A simple but flexible programming language for SN-Edit users that want more.
Currently on Node but we'll migrate to Bun once that hits v1

## Example code

```
-- Import statements
chew Sprite from pack “spritefolder” 
add Serve from *

-- @ defines built-in events
@green_flag {
    for (local count in 1..100) { -- You can also use the range() function, a la Python
        local output = ""
	
        if (count % 3 == 0) { 
          output += "Fizz"
        } else if (count % 5 == 0) {
           output += "Buzz" 
        } else { 
           output = count.toString() 
        }
	
	local db = create Serve().find()
        Sprite.say(output)    
        db.save(output) -- Saves the output to a database
    }
}
```
